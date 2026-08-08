"use client";

import { motion } from "motion/react";
import { Bot } from "lucide-react";

export function ChatThinking() {
  return (
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
  );
}
