"use client";

import { useChat, type UIMessage } from "@ai-sdk/react";
import { TextStreamChatTransport } from "ai";
import { useState, useRef, useEffect, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import Markdown from "react-markdown";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Download,
  Mail,
  AlertCircle,
} from "lucide-react";

const MemoizedMarkdown = memo(
  function MarkdownRenderer({ content }: { content: string }) { return (
    <Markdown
      components={{
        p: ({ children }) => <p className="mb-1.5 last:mb-0">{children}</p>,
        strong: ({ children }) => (
          <strong className="font-semibold">{children}</strong>
        ),
        em: ({ children }) => <em className="italic">{children}</em>,
        ul: ({ children }) => (
          <ul className="list-disc list-inside mb-1.5 last:mb-0 space-y-0.5">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside mb-1.5 last:mb-0 space-y-0.5">
            {children}
          </ol>
        ),
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline underline-offset-2 hover:text-accent-light transition-colors"
          >
            {children}
          </a>
        ),
        code: ({ children }) => (
          <code className="px-1 py-0.5 rounded bg-foreground/10 text-xs font-mono">
            {children}
          </code>
        ),
      }}
    >
      {content}
    </Markdown>
  ); },
  (prev, next) => prev.content === next.content,
);

export default function Chat({ locale = "en" }: { locale?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [shakeInput, setShakeInput] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, status, error, clearError } = useChat({
    transport: new TextStreamChatTransport({
      api: "/api/chat",
      body: { locale },
    }),
  });

  const isStreaming = status === "streaming";
  const isWaiting = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
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
    clearError();
    sendMessage({ text: input });
    setInput("");
  };

  const renderPart = (
    part: UIMessage["parts"][number],
    messageId: string,
    i: number,
  ) => {
    if (part.type === "text") {
      const isAssistant = messages.find((m) => m.id === messageId)?.role === "assistant";
      const isActiveStream =
        isStreaming &&
        messages.at(-1)?.id === messageId &&
        isAssistant;

      if (!isAssistant) {
        return (
          <span key={`${messageId}-${i}`} className="whitespace-pre-wrap">
            {part.text}
          </span>
        );
      }

      return (
        <div key={`${messageId}-${i}`} className="chat-markdown">
          <MemoizedMarkdown content={part.text} />
          {isActiveStream && (
            <span className="inline-block w-[2px] h-3.5 bg-accent rounded-full align-middle ml-0.5 animate-[cursor-blink_0.8s_steps(2)_infinite]" />
          )}
        </div>
      );
    }

    if (part.type.startsWith("tool-")) {
      const toolPart = part as UIMessage["parts"][number] & {
        toolCallId: string;
        state: string;
        output?: Record<string, unknown>;
      };

      if (toolPart.state === "output-available") {
        const output = (toolPart.output ?? {}) as Record<string, string>;

        if (part.type === "tool-downloadCV" && output.url) {
          return (
            <a
              key={`${messageId}-${i}`}
              href={output.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-1 px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-sm font-medium hover:bg-accent/20 transition-colors"
            >
              <Download className="size-3.5" />
              Download CV
            </a>
          );
        }

        if (part.type === "tool-getContact" && output.email) {
          return (
            <div key={`${messageId}-${i}`} className="flex flex-col gap-1 mt-1">
              <a
                href={`mailto:${output.email}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-sm font-medium hover:bg-accent/20 transition-colors w-fit"
              >
                <Mail className="size-3.5" />
                {output.email}
              </a>
            </div>
          );
        }

        return null;
      }

      if (toolPart.state === "call" || toolPart.state === "input-streaming") {
        return (
          <span
            key={`${messageId}-${i}`}
            className="inline-flex items-center gap-1.5 text-xs text-muted"
          >
            <Sparkles className="size-3 animate-pulse" />
            Looking up info...
          </span>
        );
      }

      return null;
    }

    return null;
  };

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
        aria-label="Open chat"
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
            className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 flex flex-col w-full h-full sm:w-[380px] sm:h-[540px] sm:rounded-2xl border-0 sm:border border-border bg-card shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 sm:px-5 py-4 pt-[max(1rem,env(safe-area-inset-top))] border-b border-border bg-card">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center size-9 rounded-full bg-accent/10">
                  <Bot className="size-4.5 text-accent" />
                  <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-green-500 ring-2 ring-card" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground leading-none">
                    Ask about Yaroslav
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    AI-powered portfolio assistant
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center size-8 rounded-lg text-muted hover:text-foreground hover:bg-foreground/5 transition-colors cursor-pointer"
                aria-label="Close chat"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-4 scroll-smooth">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center px-6 gap-4">
                  <div className="flex items-center justify-center size-14 rounded-2xl bg-accent/10">
                    <Sparkles className="size-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Hi! I know everything about Yaroslav.
                    </p>
                    <p className="text-xs text-muted mt-1.5 leading-relaxed">
                      Ask me about his experience, skills, projects, or anything
                      else.
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 mt-1">
                    {[
                      "What's his tech stack?",
                      "Tell me about his projects",
                      "Download CV",
                    ].map((q) => (
                      <button
                        key={q}
                        onClick={() => {
                          sendMessage({ text: q });
                        }}
                        className="px-3 py-1.5 text-xs rounded-full border border-border text-muted hover:text-foreground hover:border-accent/40 hover:bg-accent/5 transition-colors cursor-pointer"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message: UIMessage) => {
                const isUser = message.role === "user";
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div
                      className={`shrink-0 flex items-center justify-center size-7 rounded-full mt-0.5 ${
                        isUser
                          ? "bg-accent text-white"
                          : "bg-accent/10 text-accent"
                      }`}
                    >
                      {isUser ? (
                        <User className="size-3.5" />
                      ) : (
                        <Bot className="size-3.5" />
                      )}
                    </div>
                    <div
                      className={`flex flex-col gap-1 max-w-[80%] sm:max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        isUser
                          ? "bg-accent text-white rounded-br-md"
                          : "bg-foreground/4 text-foreground border border-border/60 rounded-bl-md"
                      }`}
                    >
                      {message.parts.map((part, i) =>
                        renderPart(part, message.id, i),
                      )}
                    </div>
                  </motion.div>
                );
              })}

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
                        <span className="size-[5px] rounded-full bg-accent/60 animate-[typing-dot_1.4s_ease-in-out_infinite]" />
                        <span className="size-[5px] rounded-full bg-accent/60 animate-[typing-dot_1.4s_ease-in-out_0.2s_infinite]" />
                        <span className="size-[5px] rounded-full bg-accent/60 animate-[typing-dot_1.4s_ease-in-out_0.4s_infinite]" />
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
                    <span className="flex-1 truncate">
                      Something went wrong. Please try again.
                    </span>
                    <button
                      onClick={clearError}
                      className="text-red-500/60 hover:text-red-500 transition-colors cursor-pointer"
                      aria-label="Dismiss error"
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
                placeholder="Ask something..."
                className={`flex-1 bg-transparent text-sm text-foreground placeholder:text-muted outline-none transition-colors ${
                  shakeInput
                    ? "placeholder:text-red-400 animate-[shake_0.4s_ease-in-out]"
                    : ""
                }`}
                disabled={isWaiting}
              />
              <button
                type="submit"
                disabled={isWaiting}
                className="flex items-center justify-center size-8 rounded-lg bg-accent text-white disabled:opacity-40 hover:bg-accent-light transition-colors cursor-pointer disabled:cursor-not-allowed"
                aria-label="Send message"
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
