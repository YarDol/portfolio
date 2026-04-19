"use client";

import { useRef, useCallback, useEffect } from "react";

interface UseBrowserTtsOptions {
  locale: string;
  onDone: () => void;
}

export function useBrowserTts({ locale, onDone }: UseBrowserTtsOptions) {
  const queueRef = useRef<string[]>([]);
  const speakingRef = useRef(false);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  const speakNext = useCallback(() => {
    if (!queueRef.current.length) {
      speakingRef.current = false;
      onDoneRef.current();
      return;
    }
    speakingRef.current = true;
    const text = queueRef.current.shift()!;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = locale === "de" ? "de-DE" : "en-US";
    utter.rate = 1.05;
    utter.onend = speakNext;
    utter.onerror = speakNext;
    window.speechSynthesis.speak(utter);
  }, [locale]);

  const enqueue = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      queueRef.current.push(text);
      if (!speakingRef.current) speakNext();
    },
    [speakNext],
  );

  const stop = useCallback(() => {
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    queueRef.current = [];
    speakingRef.current = false;
  }, []);

  return { enqueue, stop };
}
