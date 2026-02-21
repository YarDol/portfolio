"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { X, Minus, Mic } from "lucide-react";
import { useVoiceChat, type TtsEngine } from "@/hooks/use-voice-chat";
import { VoiceOrb } from "./voice-orb";
import { trackEvent } from "@/lib/gtag";

const VOICE_DISABLED = process.env.NEXT_PUBLIC_VOICE_DISABLED === "true";
const LLM_DISABLED = process.env.NEXT_PUBLIC_VOICE_LLM_DISABLED === "true";
const ELEVENLABS_DISABLED =
  process.env.NEXT_PUBLIC_VOICE_ELEVENLABS_DISABLED === "true";

export function VoiceWidget({ locale = "en" }: { locale?: string }) {
  const t = useTranslations("Voice");
  const [isOpen, setIsOpen] = useState(false);
  const [ttsEngine, setTtsEngine] = useState<TtsEngine>(
    ELEVENLABS_DISABLED ? "browser" : "browser",
  );

  const {
    state,
    transcript,
    currentResponse,
    audioLevel,
    startRecording,
    stopRecording,
    stop,
    isSupported,
  } = useVoiceChat({ locale, ttsEngine, disabled: LLM_DISABLED });

  if (!isSupported || VOICE_DISABLED) return null;
  const isActive =
    state !== "idle" &&
    state !== "error" &&
    state !== "quota" &&
    state !== "disabled";
  const isBlocked = state === "disabled" || state === "quota";

  const handleOrbClick = () => {
    if (isBlocked) return;
    if (state === "recording") stopRecording();
    else if (state === "idle" || state === "error") startRecording();

    trackEvent("voice_widget_click", {
      event_category: "engagement",
      event_label: isBlocked ? "voice_widget_blocked" : "voice_widget_opened",
      value: isBlocked ? 0 : 1,
    });
  };

  const handleClose = () => {
    stop();
    setIsOpen(false);
  };

  const handleMinimize = () => {
    setIsOpen(false);
  };

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
              {isActive ? t(state) : t("pill")}
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
                        {t(state)}
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
                      {t(state)}
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

              {!ELEVENLABS_DISABLED && !LLM_DISABLED && (
                <div
                  className="flex items-center rounded-full border border-border/50 p-0.5"
                  role="group"
                  aria-label="TTS engine"
                >
                  {(["browser", "elevenlabs"] as TtsEngine[]).map((engine) => (
                    <button
                      key={engine}
                      onClick={() => setTtsEngine(engine)}
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
        )}
      </AnimatePresence>
    </>
  );
}
