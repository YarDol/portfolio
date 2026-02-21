"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useMotionValue } from "motion/react";

export type VoiceChatState =
  | "idle"
  | "recording"
  | "transcribing"
  | "thinking"
  | "speaking"
  | "error";

export interface ConversationTurn {
  user: string;
  assistant: string;
}

interface UseVoiceChatOptions {
  locale?: string;
  silenceTimeout?: number;
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
}: UseVoiceChatOptions = {}) {
  const [state, setState] = useState<VoiceChatState>("idle");
  const [transcript, setTranscript] = useState("");
  const [currentResponse, setCurrentResponse] = useState("");
  const [conversations, setConversations] = useState<ConversationTurn[]>([]);

  const audioLevel = useMotionValue(0);

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

      let fullText = "";
      let buffer = "";

      try {
        const res = await fetch("/api/voice/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: historyRef.current, locale }),
          signal: abort.signal,
        });
        if (!res.ok) throw new Error("Chat failed");

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        setState("speaking");

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;
          fullText += chunk;
          setCurrentResponse(fullText);

          const { complete, remaining } = splitSentences(buffer);
          buffer = remaining;
          complete.forEach((s) => ttsEnqueue(s));
        }

        if (buffer.trim()) ttsEnqueue(buffer.trim());

        historyRef.current = [
          ...historyRef.current,
          { role: "assistant", content: fullText },
        ];

        setConversations((prev) => [
          ...prev,
          { user: userText, assistant: fullText },
        ]);
      } catch {
        if (abort.signal.aborted) return;
        historyRef.current = historyRef.current.slice(0, -1);
        setState("error");
      }
    },
    [locale, stopAudioPolling, ttsEnqueue],
  );

  const startRecording = useCallback(async () => {
    abortRef.current?.abort();
    const abort = new AbortController();
    abortRef.current = abort;

    stopTTS();
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
  }, [stopTTS, handleRecordingStop, startAudioPolling]);

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
    stopTTS();
    stopAudioPolling();
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    historyRef.current = [];
    setConversations([]);
    setState("idle");
    setTranscript("");
    setCurrentResponse("");
  }, [stopTTS, stopAudioPolling]);

  useEffect(() => {
    return () => {
      stopTTS();
      stopAudioPolling();
    };
  }, [stopTTS, stopAudioPolling]);

  const isSupported =
    typeof window !== "undefined" &&
    "mediaDevices" in navigator &&
    "speechSynthesis" in window;

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
