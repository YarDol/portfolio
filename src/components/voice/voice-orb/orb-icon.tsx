"use client";

import { motion } from "motion/react";
import type { VoiceChatState } from "@/hooks/use-voice-chat";

export function OrbIcon({ state }: { state: VoiceChatState }) {
  if (state === "transcribing" || state === "thinking") {
    return (
      <div className="flex items-end gap-1 h-6" aria-hidden>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-0.75 bg-white rounded-full"
            animate={{ height: ["6px", "22px", "6px"] }}
            transition={{
              duration: 0.65,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.15,
            }}
          />
        ))}
      </div>
    );
  }

  if (state === "speaking") {
    return (
      <div className="flex items-center gap-0.75 h-6" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.span
            key={i}
            className="w-0.75 bg-white rounded-full"
            animate={{ height: ["4px", i % 2 === 0 ? "22px" : "14px", "4px"] }}
            transition={{
              duration: 0.45,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.08,
            }}
          />
        ))}
      </div>
    );
  }

  if (state === "recording") {
    return (
      <motion.span
        className="block size-5 rounded-full bg-white"
        animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />
    );
  }

  if (state === "error" || state === "quota" || state === "disabled") {
    return (
      <span className="text-white text-2xl font-light select-none" aria-hidden>
        {state === "disabled" ? "×" : "!"}
      </span>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="size-9 fill-white" aria-hidden>
      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
      <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
    </svg>
  );
}
