"use client";

import { memo } from "react";
import type { UIMessage } from "@ai-sdk/react";
import { motion } from "motion/react";
import { Bot, User } from "lucide-react";
import { MarkdownRenderer } from "@/components/chat/markdown-renderer";
import { ChatToolPart, type ToolPart } from "@/components/chat/chat-tool-part";

interface ChatMessageProps {
  message: UIMessage;
  isActiveStream: boolean;
  downloadLabel: string;
  lookingUpLabel: string;
}

export const ChatMessage = memo(function ChatMessage({
  message,
  isActiveStream,
  downloadLabel,
  lookingUpLabel,
}: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      <div
        className={`shrink-0 flex items-center justify-center size-7 rounded-full mt-0.5 ${
          isUser ? "bg-accent text-white" : "bg-accent/10 text-accent"
        }`}
      >
        {isUser ? <User className="size-3.5" /> : <Bot className="size-3.5" />}
      </div>

      <div
        className={`flex flex-col gap-1 max-w-[80%] sm:max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? "bg-accent text-white rounded-br-md"
            : "bg-foreground/4 text-foreground border border-border/60 rounded-bl-md"
        }`}
      >
        {message.parts.map((part, i) => {
          if (part.type === "text") {
            if (isUser) {
              return (
                <span key={i} className="whitespace-pre-wrap">
                  {part.text}
                </span>
              );
            }
            return (
              <div key={i} className="chat-markdown">
                <MarkdownRenderer content={part.text} />
                {isActiveStream && (
                  <span className="inline-block w-0.5 h-3.5 bg-accent rounded-full align-middle ml-0.5 animate-[cursor-blink_0.8s_steps(2)_infinite]" />
                )}
              </div>
            );
          }

          if (part.type.startsWith("tool-")) {
            return (
              <ChatToolPart
                key={i}
                part={part as ToolPart}
                downloadLabel={downloadLabel}
                lookingUpLabel={lookingUpLabel}
              />
            );
          }

          return null;
        })}
      </div>
    </motion.div>
  );
});
