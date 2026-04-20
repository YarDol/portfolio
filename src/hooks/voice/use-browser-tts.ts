"use client";

import { useRef, useCallback, useEffect } from "react";
import type { VoiceChatState } from "./types";

export function useBrowserTTS(
  locale: string,
  setState: (s: VoiceChatState) => void,
) {
  const queueRef = useRef<string[]>([]);
  const speakingRef = useRef(false);
  const speakNextRef = useRef<() => void>(() => {});

  const speakNext = useCallback(() => {
    if (!queueRef.current.length) {
      speakingRef.current = false;
      setState("idle");
      return;
    }
    speakingRef.current = true;
    const text = queueRef.current.shift()!;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = locale === "de" ? "de-DE" : "en-US";
    utter.rate = 1.05;
    utter.onend = () => speakNextRef.current();
    utter.onerror = () => speakNextRef.current();
    window.speechSynthesis.speak(utter);
  }, [locale, setState]);

  useEffect(() => {
    speakNextRef.current = speakNext;
  }, [speakNext]);

  const enqueue = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      queueRef.current.push(text);
      if (!speakingRef.current) {
        setState("speaking");
        speakNext();
      }
    },
    [speakNext, setState],
  );

  const stop = useCallback(() => {
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    queueRef.current = [];
    speakingRef.current = false;
  }, []);

  return { enqueue, stop };
}
