"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle } from "lucide-react";
import { ChatMessage } from "@/components/chat/chat-message";
import { ChatWelcome } from "@/components/chat/chat-welcome";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatError } from "@/components/chat/chat-error";
import { ChatThinking } from "@/components/chat/chat-thinking";
import { ChatInput } from "@/components/chat/chat-input";
import { useAiChat } from "@/hooks/use-ai-chat";

export default function Chat({ locale = "en" }: { locale?: string }) {
  const t = useTranslations("Chat");
  const {
    isOpen,
    handleOpen,
    handleClose,
    messages,
    sendMessage,
    isStreaming,
    isWaiting,
    isThinking,
    isWelcome,
    error,
    clearError,
    input,
    setInput,
    shakeInput,
    inputRef,
    messagesEndRef,
    handleSubmit,
    voiceDisplayState,
    isVoiceSupported,
    startRecording,
    stopRecording,
  } = useAiChat({ locale });

  const quickActions = [t("quickStack"), t("quickProjects"), t("quickCV")];

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

              <AnimatePresence>{isThinking && <ChatThinking />}</AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            <AnimatePresence>
              {error && <ChatError message={t("error")} onDismiss={clearError} />}
            </AnimatePresence>

            <ChatInput
              input={input}
              onInputChange={setInput}
              onSubmit={handleSubmit}
              isWaiting={isWaiting}
              shakeInput={shakeInput}
              inputRef={inputRef}
              voiceDisplayState={voiceDisplayState}
              isVoiceSupported={isVoiceSupported}
              startRecording={startRecording}
              stopRecording={stopRecording}
              placeholder={t("placeholder")}
              submitLabel={t("placeholder")}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
