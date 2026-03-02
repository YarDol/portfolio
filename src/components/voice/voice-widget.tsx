"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { useVoiceChat, type TtsEngine } from "@/hooks/use-voice-chat";
import { trackEvent } from "@/lib/gtag";
import { VOICE_DISABLED, LLM_DISABLED, ELEVENLABS_DISABLED } from "./constants";
import { VoicePill } from "./voice-pill";
import { VoiceModal } from "./voice-modal";

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

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-48"
          >
            <VoicePill
              stateLabel={isActive ? t(state) : t("pill")}
              isActive={isActive}
              onOpen={() => setIsOpen(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <VoiceModal
            state={state}
            stateLabel={t(state)}
            isBlocked={isBlocked}
            transcript={transcript}
            currentResponse={currentResponse}
            audioLevel={audioLevel}
            ttsEngine={ttsEngine}
            onTtsEngineChange={setTtsEngine}
            onOrbClick={handleOrbClick}
            onMinimize={() => setIsOpen(false)}
            onClose={handleClose}
            getBlockedMessage={(key) => t(key as Parameters<typeof t>[0])}
            showTtsToggle={!ELEVENLABS_DISABLED && !LLM_DISABLED}
          />
        )}
      </AnimatePresence>
    </>
  );
}
