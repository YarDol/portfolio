"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Minus, Mic } from "lucide-react";
import { useVoiceChat } from "@/hooks/use-voice-chat";
import { VoiceOrb } from "./voice-orb";

const STATUS: Record<string, string> = {
  idle: "Tap to speak",
  recording: "Listening…",
  transcribing: "Processing…",
  thinking: "Thinking…",
  speaking: "Speaking…",
  error: "Something went wrong — tap to try again",
};

export function VoiceWidget({ locale = "en" }: { locale?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    state,
    transcript,
    currentResponse,
    audioLevel,
    startRecording,
    stopRecording,
    stop,
    isSupported,
  } = useVoiceChat({ locale });

  if (!isSupported) return null;

  const handleOrbClick = () => {
    if (state === "recording") stopRecording();
    else if (state === "idle" || state === "error") startRecording();
  };

  const handleClose = () => {
    stop();
    setIsOpen(false);
  };

  const handleMinimize = () => {
    setIsOpen(false);
  };

  const isActive = state !== "idle" && state !== "error";

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 flex items-center gap-2.5 pl-3 pr-4 py-2.5 rounded-full bg-card border border-border text-foreground shadow-lg hover:border-accent/40 hover:shadow-accent/10 transition-all cursor-pointer"
            aria-label="Open voice assistant"
          >
            <span className="relative flex size-2 shrink-0">
              <motion.span
                className="absolute inset-0 rounded-full bg-accent"
                animate={{ scale: [1, 2, 1], opacity: [0.6, 0, 0.6] }}
                transition={{
                  duration: isActive ? 1 : 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <span className="relative size-2 rounded-full bg-accent" />
            </span>
            <Mic className="size-3.5 text-muted" />
            <span className="text-sm font-medium">
              {isActive ? STATUS[state] : "Voice"}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "hsl(var(--background) / 0.85)" }}
            onClick={(e) => e.target === e.currentTarget && handleMinimize()}
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
                  onClick={handleMinimize}
                  className="flex items-center justify-center size-9 rounded-full text-muted hover:text-foreground hover:bg-foreground/8 transition-colors cursor-pointer"
                  aria-label="Minimize voice assistant"
                >
                  <Minus className="size-4" />
                </button>
                <button
                  onClick={handleClose}
                  className="flex items-center justify-center size-9 rounded-full text-muted hover:text-foreground hover:bg-foreground/8 transition-colors cursor-pointer"
                  aria-label="Close voice assistant"
                >
                  <X className="size-5" />
                </button>
              </div>

              <VoiceOrb
                state={state}
                audioLevel={audioLevel}
                onClick={handleOrbClick}
                size={96}
              />

              <div className="flex flex-col items-center gap-3 text-center w-full min-h-18">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={state}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.18 }}
                    className="text-sm text-muted font-medium tracking-wide"
                  >
                    {STATUS[state]}
                  </motion.p>
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
                      className="text-xs text-muted leading-relaxed max-w-60"
                    >
                      {currentResponse}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
