"use client";

import { useRef, useState, useCallback } from "react";

export type VoiceRecorderState = "idle" | "recording" | "transcribing" | "error";

interface UseVoiceRecorderOptions {
  onTranscript?: (text: string) => void;
  onError?: (msg: string) => void;
}

export function useVoiceRecorder({ onTranscript, onError }: UseVoiceRecorderOptions = {}) {
  const [state, setState] = useState<VoiceRecorderState>("idle");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const handleStop = useCallback(async () => {
    setState("transcribing");
    const blob = new Blob(chunksRef.current, { type: "audio/webm" });
    chunksRef.current = [];

    const fd = new FormData();
    fd.append("audio", blob, "audio.webm");

    try {
      const res = await fetch("/api/voice/transcribe", { method: "POST", body: fd });
      if (!res.ok) throw new Error("STT failed");
      const { text } = await res.json();
      onTranscript?.(text ?? "");
    } catch {
      onError?.("Transcription failed");
      setState("error");
      return;
    }

    setState("idle");
  }, [onTranscript, onError]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        handleStop();
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setState("recording");
    } catch {
      onError?.("Microphone access denied");
      setState("error");
    }
  }, [handleStop, onError]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const isSupported =
    typeof window !== "undefined" &&
    "mediaDevices" in navigator &&
    "speechSynthesis" in window;

  return { state, startRecording, stopRecording, isSupported };
}
