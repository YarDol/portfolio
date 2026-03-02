"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, Minus } from "lucide-react";
import type { MotionValue } from "motion/react";
import { VoiceOrb } from "./voice-orb";
import type { TtsEngine, VoiceChatState } from "@/hooks/use-voice-chat";

interface VoiceModalProps {
  state: VoiceChatState;
  stateLabel: string;
  isBlocked: boolean;
  transcript: string | null;
  currentResponse: string | null;
  audioLevel: MotionValue<number>;
  ttsEngine: TtsEngine;
  onTtsEngineChange: (engine: TtsEngine) => void;
  onOrbClick: () => void;
  onMinimize: () => void;
  onClose: () => void;
  getBlockedMessage: (stateKey: string) => string;
  showTtsToggle: boolean;
}

export function VoiceModal({
  state,
  stateLabel,
  isBlocked,
  transcript,
  currentResponse,
  audioLevel,
  ttsEngine,
  onTtsEngineChange,
  onOrbClick,
  onMinimize,
  onClose,
  getBlockedMessage,
  showTtsToggle,
}: VoiceModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "hsl(var(--background) / 0.85)" }}
      onClick={(e) => e.target === e.currentTarget && onMinimize()}
    >
      <div className="absolute inset-0 backdrop-blur-md" />

      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0, y: 24 }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
        className="relative z-10 flex flex-col items-center gap-8 py-14 px-10 w-full max-w-xs mx-4"
      >
        <div className="absolute top-0 right-0 flex items-center gap-1">
          <button
            onClick={onMinimize}
            className="flex items-center justify-center size-9 rounded-full text-muted hover:text-foreground hover:bg-foreground/8 transition-colors cursor-pointer"
            aria-label="Minimize voice assistant"
          >
            <Minus className="size-4" />
          </button>
          <button
            onClick={onClose}
            className="flex items-center justify-center size-9 rounded-full text-muted hover:text-foreground hover:bg-foreground/8 transition-colors cursor-pointer"
            aria-label="Close voice assistant"
          >
            <X className="size-5" />
          </button>
        </div>

        <VoiceOrb
          state={state}
          audioLevel={audioLevel}
          onClick={onOrbClick}
          size={96}
        />

        <div className="flex flex-col items-center gap-3 text-center w-full">
          <AnimatePresence mode="wait">
            {isBlocked ? (
              <motion.div
                key="blocked"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center gap-3 w-full px-4 py-4 rounded-2xl bg-foreground/4 border border-border/40"
              >
                <p className="text-xs text-muted leading-relaxed max-w-52">
                  {getBlockedMessage(state)}
                </p>
                <a
                  href="mailto:yardolhushyn@gmail.com"
                  className="text-xs font-medium text-accent underline-offset-2 hover:underline transition-opacity hover:opacity-80"
                >
                  yardolhushyn@gmail.com →
                </a>
              </motion.div>
            ) : (
              <motion.p
                key={state}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.18 }}
                className="text-sm text-foreground/70 font-medium tracking-wide"
              >
                {stateLabel}
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {transcript && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-sm font-semibold text-foreground leading-snug"
              >
                &ldquo;{transcript}&rdquo;
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {currentResponse && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-xs leading-relaxed max-w-60 text-foreground/85"
              >
                {currentResponse}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {showTtsToggle && (
          <div
            className="flex items-center rounded-full border border-border/50 p-0.5"
            role="group"
            aria-label="TTS engine"
          >
            {(["browser", "elevenlabs"] as TtsEngine[]).map((engine) => (
              <button
                key={engine}
                onClick={() => onTtsEngineChange(engine)}
                className={`text-xs px-3 py-1 rounded-full transition-colors cursor-pointer ${
                  ttsEngine === engine
                    ? "bg-foreground/10 text-foreground font-medium"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {engine === "browser" ? "Browser" : "ElevenLabs"}
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
