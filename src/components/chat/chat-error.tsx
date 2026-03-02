"use client";

import { motion } from "motion/react";
import { AlertCircle, X } from "lucide-react";

interface ChatErrorProps {
  message: string;
  onDismiss: () => void;
}

export function ChatError({ message, onDismiss }: ChatErrorProps) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden"
    >
      <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 dark:text-red-400 text-xs">
        <AlertCircle className="size-3.5 shrink-0" />
        <span className="flex-1 truncate">{message}</span>
        <button
          onClick={onDismiss}
          className="text-red-500/60 hover:text-red-500 transition-colors cursor-pointer"
          aria-label="Dismiss"
        >
          <X className="size-3" />
        </button>
      </div>
    </motion.div>
  );
}
