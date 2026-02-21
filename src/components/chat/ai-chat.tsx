"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useTranslations } from "next-intl";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  AlertCircle,
} from "lucide-react";
import { useVoiceRecorder } from "@/hooks/use-voice-recorder";
import { useTTS } from "@/hooks/use-tts";
import {
  VoiceButton,
  type VoiceButtonDisplayState,
} from "@/components/chat/voice-button";
import { ChatMessage } from "@/components/chat/chat-message";
import { ChatWelcome } from "@/components/chat/chat-welcome";

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

  const { isSpeaking: isTtsSpeaking, stop: ttsStop, feedChunk, flush: ttsFlush } = useTTS({
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
  };

  const quickActions = [t("quickStack"), t("quickProjects"), t("quickCV")];

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
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
            <div className="flex items-center justify-between px-4 sm:px-5 py-4 pt-[max(1rem,env(safe-area-inset-top))] border-b border-border bg-card">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center size-9 rounded-full bg-accent/10">
                  <Bot className="size-4.5 text-accent" />
                  <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-green-500 ring-2 ring-card" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground leading-none">
                    {t("title")}
                  </p>
                  <p className="text-xs text-muted mt-0.5">{t("subtitle")}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  ttsStop();
                  setIsOpen(false);
                }}
                className="flex items-center justify-center size-8 rounded-lg text-muted hover:text-foreground hover:bg-foreground/5 transition-colors cursor-pointer"
                aria-label={t("title")}
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-4 scroll-smooth">
              {messages.length === 0 && (
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
                {isWaiting && messages.at(-1)?.role !== "assistant" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex gap-2.5"
                  >
                    <div className="shrink-0 flex items-center justify-center size-7 rounded-full bg-accent/10 text-accent">
                      <Bot className="size-3.5" />
                    </div>
                    <div className="px-3.5 py-3 rounded-2xl rounded-bl-md bg-foreground/4 border border-border/60">
                      <div className="flex gap-1 items-center">
                        <span className="size-1.25 rounded-full bg-accent/60 animate-[typing-dot_1.4s_ease-in-out_infinite]" />
                        <span className="size-1.25 rounded-full bg-accent/60 animate-[typing-dot_1.4s_ease-in-out_0.2s_infinite]" />
                        <span className="size-1.25 rounded-full bg-accent/60 animate-[typing-dot_1.4s_ease-in-out_0.4s_infinite]" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 dark:text-red-400 text-xs">
                    <AlertCircle className="size-3.5 shrink-0" />
                    <span className="flex-1 truncate">{t("error")}</span>
                    <button
                      onClick={clearError}
                      className="text-red-500/60 hover:text-red-500 transition-colors cursor-pointer"
                      aria-label="Dismiss"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                </motion.div>
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
