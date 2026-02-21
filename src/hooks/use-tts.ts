"use client";

import { useCallback, useEffect, useRef, useState } from "react";

function extractSentences(text: string): {
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

export function useTTS({ locale }: { locale: string }) {
  const queueRef = useRef<string[]>([]);
  const speakingRef = useRef(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const bufferRef = useRef("");

  const speakNextRef = useRef<() => void>(() => {});

  const speakNext = useCallback(() => {
    if (!queueRef.current.length) {
      speakingRef.current = false;
      setIsSpeaking(false);
      return;
    }
    speakingRef.current = true;
    setIsSpeaking(true);
    const text = queueRef.current.shift()!;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = locale === "de" ? "de-DE" : "en-US";
    utter.rate = 1.05;
    utter.onend = () => speakNextRef.current();
    utter.onerror = () => speakNextRef.current();
    window.speechSynthesis.speak(utter);
  }, [locale]);

  useEffect(() => {
    speakNextRef.current = speakNext;
  }, [speakNext]);

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
    setIsSpeaking(false);
    bufferRef.current = "";
  }, []);

  const feedChunk = useCallback(
    (newText: string) => {
      bufferRef.current += newText;
      const { complete, remaining } = extractSentences(bufferRef.current);
      bufferRef.current = remaining;
      complete.forEach((s) => enqueue(s));
    },
    [enqueue],
  );

  const flush = useCallback(() => {
    if (bufferRef.current.trim()) {
      enqueue(bufferRef.current.trim());
    }
    bufferRef.current = "";
  }, [enqueue]);

  return { isSpeaking, stop, feedChunk, flush };
}
