"use client";

import { motion } from "motion/react";
import { Mic } from "lucide-react";
import { CatAnimation } from "../animations/cat-animation";

interface VoicePillProps {
  stateLabel: string;
  isActive: boolean;
  onOpen: () => void;
}

export function VoicePill({ stateLabel, isActive, onOpen }: VoicePillProps) {
  return (
    <div className="relative">
      <div
        className="absolute pointer-events-none"
        style={{ bottom: "100%", left: 0 }}
      >
        <CatAnimation />
      </div>

      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={onOpen}
        className="flex items-center gap-2.5 pl-3 pr-4 py-2.5 rounded-full bg-card border border-foreground/15 text-foreground shadow-lg hover:border-foreground/30 transition-all cursor-pointer"
        aria-label="Open voice assistant"
      >
        <span className="relative flex size-2 shrink-0">
          <motion.span
            className="absolute inset-0 rounded-full bg-foreground"
            animate={{ scale: [1, 2.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{
              duration: isActive ? 1 : 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <span className="relative size-2 rounded-full bg-foreground" />
        </span>
        <Mic className="size-3.5 text-muted" />
        <span className="text-sm font-medium">{stateLabel}</span>
      </motion.button>
    </div>
  );
}
