"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useMotionValue } from "motion/react";
import type { VoiceChatState, TtsEngine, ConversationTurn, UseVoiceChatOptions } from "./voice/types";
import { splitSentences } from "./voice/lib/split-sentences";
import { useBrowserTts } from "./voice/use-browser-tts";
import { useElevenTts } from "./voice/use-eleven-tts";
import { useAudioPolling } from "./voice/use-audio-polling";

export type { VoiceChatState, TtsEngine, ConversationTurn };

async function transcribeAudio(blob: Blob, signal: AbortSignal): Promise<string> {
  const fd = new FormData();
  fd.append("audio", blob, "audio.webm");
  const res = await fetch("/api/voice/transcribe", { method: "POST", body: fd, signal });
  if (!res.ok) throw new Error("STT failed");
  const json = await res.json();
  return json.text?.trim() ?? "";
}

async function fetchChatResponse(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  locale: string,
  signal: AbortSignal,
): Promise<{ status: number; text: string | null }> {
  const res = await fetch("/api/voice/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, locale }),
    signal,
  });
  if (!res.ok) return { status: res.status, text: null };
  const { text } = await res.json();
  return { status: res.status, text: text?.trim() || null };
}

export function useVoiceChat({
  locale = "en",
  silenceTimeout = 1000,
  ttsEngine = "browser",
  disabled = false,
}: UseVoiceChatOptions = {}) {
  const [state, setState] = useState<VoiceChatState>(disabled ? "disabled" : "idle");
  const [transcript, setTranscript] = useState("");
  const [currentResponse, setCurrentResponse] = useState("");
  const [conversations, setConversations] = useState<ConversationTurn[]>([]);

  const audioLevel = useMotionValue(0);
  const ttsEngineRef = useRef(ttsEngine);
  const disabledRef = useRef(disabled);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const historyRef = useRef<Array<{ role: "user" | "assistant"; content: string }>>([]);

  useEffect(() => { ttsEngineRef.current = ttsEngine; }, [ttsEngine]);
  useEffect(() => { disabledRef.current = disabled; }, [disabled]);

  const handleTtsDone = useCallback(() => setState("idle"), []);

  const browserTts = useBrowserTts({ locale, onDone: handleTtsDone });
  const elevenTts = useElevenTts({ onDone: handleTtsDone });

  const stopAllTTS = useCallback(() => {
    browserTts.stop();
    elevenTts.stop();
  }, [browserTts, elevenTts]);

  const onSilence = useCallback(() => {
    const rec = mediaRecorderRef.current;
    if (rec?.state === "recording") rec.stop();
  }, []);

  const audioPolling = useAudioPolling({ silenceTimeout, audioLevel, onSilence });

  const handleRecordingStop = useCallback(
    async (abort: AbortController) => {
      if (abort.signal.aborted) return;
      audioPolling.stop();
      setState("transcribing");

      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      chunksRef.current = [];

      let userText: string;
      try {
        userText = await transcribeAudio(blob, abort.signal);
      } catch {
        if (abort.signal.aborted) return;
        setState("error");
        return;
      }

      if (!userText) { setState("idle"); return; }

      setTranscript(userText);
      setCurrentResponse("");
      setState("thinking");

      historyRef.current = [...historyRef.current, { role: "user", content: userText }];

      const enqueue = ttsEngineRef.current === "elevenlabs" ? elevenTts.enqueue : browserTts.enqueue;

      try {
        const { status, text } = await fetchChatResponse(historyRef.current, locale, abort.signal);

        if (status === 503) { historyRef.current = historyRef.current.slice(0, -1); setState("disabled"); return; }
        if (status === 429) { historyRef.current = historyRef.current.slice(0, -1); setState("quota"); return; }
        if (!text) { historyRef.current = historyRef.current.slice(0, -1); setState("idle"); return; }

        setCurrentResponse(text);
        setState("speaking");
        const { complete, remaining } = splitSentences(text);
        complete.forEach((s) => enqueue(s));
        if (remaining.trim()) enqueue(remaining.trim());

        historyRef.current = [...historyRef.current, { role: "assistant", content: text }];
        setConversations((prev) => [...prev, { user: userText, assistant: text }]);
      } catch {
        if (abort.signal.aborted) return;
        historyRef.current = historyRef.current.slice(0, -1);
        setState("error");
      }
    },
    [locale, audioPolling, browserTts.enqueue, elevenTts.enqueue],
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
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = () => { stream.getTracks().forEach((t) => t.stop()); handleRecordingStop(abort); };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setState("recording");
      audioPolling.start(stream);
    } catch {
      setState("error");
    }
  }, [disabled, stopAllTTS, handleRecordingStop, audioPolling]);

  const stopRecording = useCallback(() => {
    audioPolling.clearSilenceTimer();
    if (mediaRecorderRef.current?.state === "recording") mediaRecorderRef.current.stop();
  }, [audioPolling]);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    stopAllTTS();
    audioPolling.stop();
    if (mediaRecorderRef.current?.state === "recording") mediaRecorderRef.current.stop();
    historyRef.current = [];
    setConversations([]);
    setState(disabledRef.current ? "disabled" : "idle");
    setTranscript("");
    setCurrentResponse("");
  }, [stopAllTTS, audioPolling]);

  useEffect(() => () => { stopAllTTS(); audioPolling.stop(); }, [stopAllTTS, audioPolling]);

  const [isSupported, setIsSupported] = useState(false);
  useEffect(() => {
    setIsSupported("mediaDevices" in navigator && "speechSynthesis" in window);
  }, []);

  return { state, transcript, currentResponse, conversations, audioLevel, startRecording, stopRecording, stop, isSupported };
}
