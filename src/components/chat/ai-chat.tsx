"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useTranslations } from "next-intl";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, Send } from "lucide-react";
import { useVoiceRecorder } from "@/hooks/use-voice-recorder";
import { useTTS } from "@/hooks/use-tts";
import {
  VoiceButton,
  type VoiceButtonDisplayState,
} from "@/components/chat/voice-button";
import { ChatMessage } from "@/components/chat/chat-message";
import { ChatWelcome } from "@/components/chat/chat-welcome";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatError } from "@/components/chat/chat-error";
import { ChatThinking } from "@/components/chat/chat-thinking";
import { trackEvent } from "@/lib/gtag";

export default function Chat({ locale = "en" }: { locale?: string }) {
  const t = useTranslations("Chat");
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [shakeInput, setShakeInput] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, status, error, clearError } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { locale },
    }),
  });

  const isStreaming = status === "streaming";
  const isWaiting = status === "submitted" || status === "streaming";

  const {
    isSpeaking: isTtsSpeaking,
    stop: ttsStop,
    feedChunk,
    flush: ttsFlush,
  } = useTTS({
    locale: locale ?? "en",
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

  const {
    state: voiceState,
    startRecording,
    stopRecording,
    isSupported,
  } = useVoiceRecorder({
    onTranscript: (text) => {
      if (!text.trim()) return;
      ttsStop();
      lastSeenLengthRef.current = 0;
      activateVoice();
      clearError();
      sendMessage({ text });
    },
    onError: () => {
      deactivateVoice();
    },
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
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
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

  const quickActions = [t("quickStack"), t("quickProjects"), t("quickCV")];
  const isThinking = isWaiting && messages.at(-1)?.role !== "assistant";
  const isWelcome = messages.length === 0;

  return (
    <>
      <motion.button
        onClick={handleOpen}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center justify-center size-12 sm:size-14 rounded-full bg-accent text-white shadow-lg shadow-accent/25 hover:shadow-accent/40 transition-shadow cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: isOpen ? 0 : 1,
          y: isOpen ? 20 : 0,
          pointerEvents: isOpen ? "none" : "auto",
        }}
        transition={{ duration: 0.2 }}
        aria-label={t("title")}
      >
        <MessageCircle className="size-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 flex flex-col w-full h-full sm:w-95 sm:h-135 sm:rounded-2xl border-0 sm:border border-border bg-card shadow-2xl overflow-hidden"
          >
            <ChatHeader
              title={t("title")}
              subtitle={t("subtitle")}
              onClose={handleClose}
            />

            <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-4 scroll-smooth">
              {isWelcome && (
                <ChatWelcome
                  title={t("welcome")}
                  subtitle={t("welcomeSub")}
                  quickActions={quickActions}
                  onAction={(text) => sendMessage({ text })}
                />
              )}

              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isActiveStream={
                    isStreaming &&
                    messages.at(-1)?.id === message.id &&
                    message.role === "assistant"
                  }
                  downloadLabel={t("downloadCV")}
                  lookingUpLabel={t("lookingUp")}
                />
              ))}

              <AnimatePresence>
                {isThinking && <ChatThinking />}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            <AnimatePresence>
              {error && (
                <ChatError message={t("error")} onDismiss={clearError} />
              )}
            </AnimatePresence>

            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] border-t border-border bg-card"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("placeholder")}
                className={`flex-1 bg-transparent text-sm text-foreground placeholder:text-muted outline-none transition-colors ${
                  shakeInput
                    ? "placeholder:text-red-400 animate-[shake_0.4s_ease-in-out]"
                    : ""
                }`}
                disabled={isWaiting}
              />
              {isSupported && (
                <VoiceButton
                  displayState={voiceDisplayState}
                  onStart={startRecording}
                  onStop={stopRecording}
                  disabled={isWaiting && voiceDisplayState === "idle"}
                />
              )}
              <button
                type="submit"
                disabled={isWaiting}
                className="flex items-center justify-center size-8 rounded-lg bg-accent text-white disabled:opacity-40 hover:bg-accent-light transition-colors cursor-pointer disabled:cursor-not-allowed"
                aria-label={t("placeholder")}
              >
                <Send className="size-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
