"use client";

import { useEffect } from "react";
import type { UIMessage } from "@ai-sdk/react";

interface UseTtsStreamingOptions {
  messages: UIMessage[];
  status: string;
  feedChunk: (text: string) => void;
  ttsFlush: () => void;
  voiceActiveRef: React.RefObject<boolean>;
  lastSeenLengthRef: React.RefObject<number>;
}

export function useTtsStreaming({
  messages,
  status,
  feedChunk,
  ttsFlush,
  voiceActiveRef,
  lastSeenLengthRef,
}: UseTtsStreamingOptions) {
  useEffect(() => {
    if (!voiceActiveRef.current) return;
    const lastMsg = messages.at(-1);
    if (!lastMsg || lastMsg.role !== "assistant") return;

    const textContent = lastMsg.parts
      .filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("");

    const newText = textContent.slice(lastSeenLengthRef.current);
    if (!newText) return;

    lastSeenLengthRef.current = textContent.length;
    feedChunk(newText);
  }, [messages, feedChunk, voiceActiveRef, lastSeenLengthRef]);

  useEffect(() => {
    if (status !== "ready" || !voiceActiveRef.current) return;
    ttsFlush();
    voiceActiveRef.current = false;
    lastSeenLengthRef.current = 0;
  }, [status, ttsFlush, voiceActiveRef, lastSeenLengthRef]);
}
