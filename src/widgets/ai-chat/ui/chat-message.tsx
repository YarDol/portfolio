"use client";

import { memo } from "react";
import type { UIMessage } from "@ai-sdk/react";
import Markdown from "react-markdown";
import { motion } from "motion/react";
import { Bot, Download, Mail, Sparkles, User } from "lucide-react";

const MemoizedMarkdown = memo(
  function MarkdownRenderer({ content }: { content: string }) {
    return (
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
          li: ({ children }) => (
            <li className="leading-relaxed">{children}</li>
          ),
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
    );
  },
  (prev, next) => prev.content === next.content,
);

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
                <MemoizedMarkdown content={part.text} />
                {isActiveStream && (
                  <span className="inline-block w-0.5 h-3.5 bg-accent rounded-full align-middle ml-0.5 animate-[cursor-blink_0.8s_steps(2)_infinite]" />
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
                    key={i}
                    href={output.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-1 px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-sm font-medium hover:bg-accent/20 transition-colors"
                  >
                    <Download className="size-3.5" />
                    {downloadLabel}
                  </a>
                );
              }

              if (part.type === "tool-getContact" && output.email) {
                return (
                  <div key={i} className="flex flex-col gap-1 mt-1">
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

            if (
              toolPart.state === "call" ||
              toolPart.state === "input-streaming"
            ) {
              return (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 text-xs text-muted"
                >
                  <Sparkles className="size-3 animate-pulse" />
                  {lookingUpLabel}
                </span>
              );
            }

            return null;
          }

          return null;
        })}
      </div>
    </motion.div>
  );
});
