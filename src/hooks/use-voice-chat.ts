"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useMotionValue } from "motion/react";
import type { VoiceChatState, TtsEngine, ConversationTurn } from "./voice/types";
import { splitSentences } from "./voice/split-sentences";
import { useBrowserTTS } from "./voice/use-browser-tts";
import { useElevenTTS } from "./voice/use-eleven-tts";
import { useAudioLevel } from "./voice/use-audio-level";

export type { VoiceChatState, TtsEngine, ConversationTurn };

interface UseVoiceChatOptions {
  locale?: string;
  silenceTimeout?: number;
  ttsEngine?: TtsEngine;
  disabled?: boolean;
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

  useEffect(() => { ttsEngineRef.current = ttsEngine; }, [ttsEngine]);
  useEffect(() => { disabledRef.current = disabled; }, [disabled]);

  const browserTTS = useBrowserTTS(locale, setState);
  const elevenTTS = useElevenTTS(setState);

  const stopAllTTS = useCallback(() => {
    browserTTS.stop();
    elevenTTS.stop();
  }, [browserTTS, elevenTTS]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const historyRef = useRef<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);

  const onSilence = useCallback(() => {
    const rec = mediaRecorderRef.current;
    if (rec?.state === "recording") rec.stop();
  }, []);

  const { start: startAudioLevel, stop: stopAudioLevel, clearSilenceTimer } =
    useAudioLevel(audioLevel, silenceTimeout, onSilence);

  const handleRecordingStop = useCallback(
    async (abort: AbortController) => {
      if (abort.signal.aborted) return;
      stopAudioLevel();
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

      if (!userText) { setState("idle"); return; }

      setTranscript(userText);
      setCurrentResponse("");
      setState("thinking");

      historyRef.current = [
        ...historyRef.current,
        { role: "user", content: userText },
      ];

      const enqueue =
        ttsEngineRef.current === "elevenlabs"
          ? elevenTTS.enqueue
          : browserTTS.enqueue;

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
    [locale, stopAudioLevel, browserTTS.enqueue, elevenTTS.enqueue],
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
      startAudioLevel(stream);
    } catch {
      setState("error");
    }
  }, [disabled, stopAllTTS, handleRecordingStop, startAudioLevel]);

  const stopRecording = useCallback(() => {
    clearSilenceTimer();
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  }, [clearSilenceTimer]);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    stopAllTTS();
    stopAudioLevel();
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    historyRef.current = [];
    setConversations([]);
    setState(disabledRef.current ? "disabled" : "idle");
    setTranscript("");
    setCurrentResponse("");
  }, [stopAllTTS, stopAudioLevel]);

  useEffect(() => {
    return () => {
      stopAllTTS();
      stopAudioLevel();
    };
  }, [stopAllTTS, stopAudioLevel]);

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
