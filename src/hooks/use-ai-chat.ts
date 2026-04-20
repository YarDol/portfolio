"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect } from "react";
import { useVoiceRecorder } from "@/hooks/use-voice-recorder";
import { useTTS } from "@/hooks/use-tts";
import { trackEvent } from "@/lib/gtag";
import type { VoiceButtonDisplayState } from "@/components/chat/voice-button";

export function useAiChat({ locale = "en" }: { locale?: string } = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [shakeInput, setShakeInput] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, status, error, clearError } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat", body: { locale } }),
  });

  const isStreaming = status === "streaming";
  const isWaiting = status === "submitted" || status === "streaming";

  const { isSpeaking: isTtsSpeaking, stop: ttsStop, feedChunk, flush: ttsFlush } = useTTS({
    locale,
  });

  const lastSeenLengthRef = useRef(0);
  const voiceActiveRef = useRef(false);
  const [voiceActive, setVoiceActive] = useState(false);

  const activateVoice = () => {
    voiceActiveRef.current = true;
    setVoiceActive(true);
  };

  const deactivateVoice = () => {
    voiceActiveRef.current = false;
    setVoiceActive(false);
  };

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
  }, [messages, feedChunk]);

  useEffect(() => {
    if (status !== "ready" || !voiceActiveRef.current) return;
    ttsFlush();
    voiceActiveRef.current = false;
    lastSeenLengthRef.current = 0;
  }, [status, ttsFlush]);

  const { state: voiceState, startRecording, stopRecording, isSupported } = useVoiceRecorder({
    onTranscript: (text) => {
      if (!text.trim()) return;
      ttsStop();
      lastSeenLengthRef.current = 0;
      activateVoice();
      clearError();
      sendMessage({ text });
    },
    onError: () => deactivateVoice(),
  });

  const voiceDisplayState: VoiceButtonDisplayState = (() => {
    if (voiceState === "recording") return "recording";
    if (voiceState === "transcribing") return "transcribing";
    if (voiceState === "error") return "error";
    if (isWaiting && voiceActive) return "thinking";
    if (isTtsSpeaking) return "speaking";
    return "idle";
  })();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isWaiting]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isWaiting) return;
    if (!input.trim()) {
      setShakeInput(true);
      inputRef.current?.focus();
      setTimeout(() => setShakeInput(false), 500);
      return;
    }
    ttsStop();
    deactivateVoice();
    clearError();
    sendMessage({ text: input });
    setInput("");
    trackEvent("ai_message_send", {
      event_category: "engagement",
      event_label: "ai_message_send",
      value: input.length,
    });
  };

  const handleOpen = () => {
    setIsOpen(true);
    trackEvent("ai_button_click", {
      event_category: "engagement",
      event_label: "chat_open",
      value: 1,
    });
  };

  const handleClose = () => {
    ttsStop();
    setIsOpen(false);
  };

  return {
    isOpen,
    handleOpen,
    handleClose,
    messages,
    sendMessage,
    isStreaming,
    isWaiting,
    isThinking: isWaiting && messages.at(-1)?.role !== "assistant",
    isWelcome: messages.length === 0,
    error,
    clearError,
    input,
    setInput,
    shakeInput,
    inputRef,
    messagesEndRef,
    handleSubmit,
    voiceDisplayState,
    isVoiceSupported: isSupported,
    startRecording,
    stopRecording,
  };
}
