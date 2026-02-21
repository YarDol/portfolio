"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useMotionValue } from "motion/react";

export type VoiceChatState =
  | "idle"
  | "recording"
  | "transcribing"
  | "thinking"
  | "speaking"
  | "error"
  | "quota"
  | "disabled";

export type TtsEngine = "browser" | "elevenlabs";

export interface ConversationTurn {
  user: string;
  assistant: string;
}

interface UseVoiceChatOptions {
  locale?: string;
  silenceTimeout?: number;
  ttsEngine?: TtsEngine;
  disabled?: boolean;
}

function splitSentences(text: string): {
  complete: string[];
  remaining: string;
} {
  const re = /[^.!?]+[.!?]+\s*/g;
  const complete: string[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    complete.push(match[0].trim());
    lastIndex = re.lastIndex;
  }
  return { complete, remaining: text.slice(lastIndex) };
}

export function useVoiceChat({
  locale = "en",
  silenceTimeout = 1000,
  ttsEngine = "browser",
  disabled = false,
}: UseVoiceChatOptions = {}) {
  const [state, setState] = useState<VoiceChatState>(
    disabled ? "disabled" : "idle",
  );
  const [transcript, setTranscript] = useState("");
  const [currentResponse, setCurrentResponse] = useState("");
  const [conversations, setConversations] = useState<ConversationTurn[]>([]);

  const audioLevel = useMotionValue(0);

  const ttsEngineRef = useRef(ttsEngine);
  const disabledRef = useRef(disabled);

  useEffect(() => {
    ttsEngineRef.current = ttsEngine;
  }, [ttsEngine]);

  useEffect(() => {
    disabledRef.current = disabled;
  }, [disabled]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const historyRef = useRef<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);

  const ttsQueueRef = useRef<string[]>([]);
  const ttsSpeakingRef = useRef(false);

  const ttsSpeakNext = useCallback(() => {
    if (!ttsQueueRef.current.length) {
      ttsSpeakingRef.current = false;
      setState("idle");
      return;
    }
    ttsSpeakingRef.current = true;
    const text = ttsQueueRef.current.shift()!;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = locale === "de" ? "de-DE" : "en-US";
    utter.rate = 1.05;
    utter.onend = ttsSpeakNext;
    utter.onerror = ttsSpeakNext;
    window.speechSynthesis.speak(utter);
  }, [locale]);

  const ttsEnqueue = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      ttsQueueRef.current.push(text);
      if (!ttsSpeakingRef.current) {
        setState("speaking");
        ttsSpeakNext();
      }
    },
    [ttsSpeakNext],
  );

  const stopTTS = useCallback(() => {
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    ttsQueueRef.current = [];
    ttsSpeakingRef.current = false;
  }, []);

  const elevenQueueRef = useRef<string[]>([]);
  const elevenPlayingRef = useRef(false);
  const elevenAudioRef = useRef<HTMLAudioElement | null>(null);
  const elevenFetchAbortRef = useRef<AbortController | null>(null);

  const stopElevenTTS = useCallback(() => {
    elevenFetchAbortRef.current?.abort();
    if (elevenAudioRef.current) {
      elevenAudioRef.current.pause();
      elevenAudioRef.current.src = "";
      elevenAudioRef.current = null;
    }
    elevenQueueRef.current = [];
    elevenPlayingRef.current = false;
  }, []);

  const elevenSpeakNext = useCallback(async () => {
    if (!elevenQueueRef.current.length) {
      elevenPlayingRef.current = false;
      setState("idle");
      return;
    }
    elevenPlayingRef.current = true;
    const text = elevenQueueRef.current.shift()!;

    const aborter = new AbortController();
    elevenFetchAbortRef.current = aborter;

    try {
      const res = await fetch("/api/voice/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
        signal: aborter.signal,
      });
      if (!res.ok) throw new Error("TTS failed");

      const blob = await res.blob();
      if (aborter.signal.aborted) return;

      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      elevenAudioRef.current = audio;

      audio.onended = () => {
        URL.revokeObjectURL(url);
        elevenAudioRef.current = null;
        if (!aborter.signal.aborted) elevenSpeakNext();
      };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        elevenAudioRef.current = null;
        if (!aborter.signal.aborted) elevenSpeakNext();
      };

      audio.play().catch(() => {
        if (!aborter.signal.aborted) elevenSpeakNext();
      });
    } catch {
      if (!aborter.signal.aborted) elevenSpeakNext();
    }
  }, []);

  const elevenEnqueue = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      elevenQueueRef.current.push(text);
      if (!elevenPlayingRef.current) {
        setState("speaking");
        elevenSpeakNext();
      }
    },
    [elevenSpeakNext],
  );

  const stopAllTTS = useCallback(() => {
    stopTTS();
    stopElevenTTS();
  }, [stopTTS, stopElevenTTS]);

  const stopAudioPolling = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    audioLevel.set(0);
    analyserRef.current = null;
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
  }, [audioLevel]);

  const startAudioPolling = useCallback(
    (stream: MediaStream) => {
      const ctx = new AudioContext();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      audioCtxRef.current = ctx;
      analyserRef.current = analyser;

      const data = new Uint8Array(analyser.frequencyBinCount);

      function tick() {
        if (!analyserRef.current) return;
        analyser.getByteFrequencyData(data);
        const sum = data.reduce((a, b) => a + b, 0);
        const level = Math.min(1, sum / (data.length * 80));
        audioLevel.set(level);

        if (level < 0.02) {
          if (!silenceTimerRef.current) {
            silenceTimerRef.current = setTimeout(() => {
              silenceTimerRef.current = null;
              const rec = mediaRecorderRef.current;
              if (rec?.state === "recording") rec.stop();
            }, silenceTimeout);
          }
        } else {
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
          }
        }

        animFrameRef.current = requestAnimationFrame(tick);
      }

      animFrameRef.current = requestAnimationFrame(tick);
    },
    [audioLevel, silenceTimeout],
  );

  const handleRecordingStop = useCallback(
    async (abort: AbortController) => {
      if (abort.signal.aborted) return;
      stopAudioPolling();
      setState("transcribing");

      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      chunksRef.current = [];

      const fd = new FormData();
      fd.append("audio", blob, "audio.webm");

      let userText = "";
      try {
        const res = await fetch("/api/voice/transcribe", {
          method: "POST",
          body: fd,
          signal: abort.signal,
        });
        if (!res.ok) throw new Error("STT failed");
        const json = await res.json();
        userText = json.text?.trim() ?? "";
      } catch {
        if (abort.signal.aborted) return;
        setState("error");
        return;
      }

      if (!userText) {
        setState("idle");
        return;
      }

      setTranscript(userText);
      setCurrentResponse("");
      setState("thinking");

      historyRef.current = [
        ...historyRef.current,
        { role: "user", content: userText },
      ];

      const enqueue =
        ttsEngineRef.current === "elevenlabs" ? elevenEnqueue : ttsEnqueue;

      try {
        const res = await fetch("/api/voice/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: historyRef.current, locale }),
          signal: abort.signal,
        });

        if (res.status === 503) {
          historyRef.current = historyRef.current.slice(0, -1);
          setState("disabled");
          return;
        }

        if (res.status === 429) {
          historyRef.current = historyRef.current.slice(0, -1);
          setState("quota");
          return;
        }

        if (!res.ok) throw new Error("Chat failed");

        const { text } = await res.json();
        if (!text?.trim()) {
          historyRef.current = historyRef.current.slice(0, -1);
          setState("idle");
          return;
        }

        setCurrentResponse(text);
        setState("speaking");

        const { complete, remaining } = splitSentences(text);
        complete.forEach((s) => enqueue(s));
        if (remaining.trim()) enqueue(remaining.trim());

        historyRef.current = [
          ...historyRef.current,
          { role: "assistant", content: text },
        ];
        setConversations((prev) => [
          ...prev,
          { user: userText, assistant: text },
        ]);
      } catch {
        if (abort.signal.aborted) return;
        historyRef.current = historyRef.current.slice(0, -1);
        setState("error");
      }
    },
    [locale, stopAudioPolling, ttsEnqueue, elevenEnqueue],
  );

  const startRecording = useCallback(async () => {
    if (disabled) return;
    abortRef.current?.abort();
    const abort = new AbortController();
    abortRef.current = abort;

    stopAllTTS();
    setTranscript("");
    setCurrentResponse("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        handleRecordingStop(abort);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setState("recording");
      startAudioPolling(stream);
    } catch {
      setState("error");
    }
  }, [disabled, stopAllTTS, handleRecordingStop, startAudioPolling]);

  const stopRecording = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    stopAllTTS();
    stopAudioPolling();
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    historyRef.current = [];
    setConversations([]);
    setState(disabledRef.current ? "disabled" : "idle");
    setTranscript("");
    setCurrentResponse("");
  }, [stopAllTTS, stopAudioPolling]);

  useEffect(() => {
    return () => {
      stopAllTTS();
      stopAudioPolling();
    };
  }, [stopAllTTS, stopAudioPolling]);

  const [isSupported, setIsSupported] = useState(false);
  useEffect(() => {
    setIsSupported(
      "mediaDevices" in navigator && "speechSynthesis" in window,
    );
  }, []);

  return {
    state,
    transcript,
    currentResponse,
    conversations,
    audioLevel,
    startRecording,
    stopRecording,
    stop,
    isSupported,
  };
}
