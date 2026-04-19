"use client";

import { useRef, useCallback, useEffect } from "react";

interface UseElevenTtsOptions {
  onDone: () => void;
}

export function useElevenTts({ onDone }: UseElevenTtsOptions) {
  const queueRef = useRef<string[]>([]);
  const playingRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fetchAbortRef = useRef<AbortController | null>(null);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  const speakNext = useCallback(async () => {
    if (!queueRef.current.length) {
      playingRef.current = false;
      onDoneRef.current();
      return;
    }
    playingRef.current = true;
    const text = queueRef.current.shift()!;

    const aborter = new AbortController();
    fetchAbortRef.current = aborter;

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
      audioRef.current = audio;

      audio.onended = () => {
        URL.revokeObjectURL(url);
        audioRef.current = null;
        if (!aborter.signal.aborted) speakNext();
      };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        audioRef.current = null;
        if (!aborter.signal.aborted) speakNext();
      };
      audio.play().catch(() => {
        if (!aborter.signal.aborted) speakNext();
      });
    } catch {
      if (!aborter.signal.aborted) speakNext();
    }
  }, []);

  const enqueue = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      queueRef.current.push(text);
      if (!playingRef.current) speakNext();
    },
    [speakNext],
  );

  const stop = useCallback(() => {
    fetchAbortRef.current?.abort();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    queueRef.current = [];
    playingRef.current = false;
  }, []);

  return { enqueue, stop };
}
