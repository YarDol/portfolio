"use client";

import { motion, type MotionValue } from "motion/react";
import type { VoiceChatState } from "@/hooks/use-voice-chat";
import { OrbIcon } from "./voice-orb/orb-icon";
import { Ring } from "./voice-orb/ring";

interface VoiceOrbProps {
  state: VoiceChatState;
  audioLevel: MotionValue<number>;
  onClick?: () => void;
  size?: number;
}

export function VoiceOrb({
  state,
  audioLevel,
  onClick,
  size = 96,
}: VoiceOrbProps) {
  const isError =
    state === "error" || state === "quota" || state === "disabled";
  const isIdle =
    state === "idle" ||
    state === "error" ||
    state === "quota" ||
    state === "disabled";

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size * 3, height: size * 3 }}
    >
      <Ring
        multiplier={1.9}
        orbSize={size}
        audioLevel={audioLevel}
        audioGain={0.65}
        state={state}
        delay={0.2}
        opacity="border-accent/15"
      />
      <Ring
        multiplier={1.5}
        orbSize={size}
        audioLevel={audioLevel}
        audioGain={0.5}
        state={state}
        delay={0.1}
        opacity="border-accent/25"
      />
      <Ring
        multiplier={1.2}
        orbSize={size}
        audioLevel={audioLevel}
        audioGain={0.35}
        state={state}
        delay={0}
        opacity="border-accent/45"
      />

      <motion.div
        className={`absolute rounded-full pointer-events-none ${isError ? "bg-red-500" : "bg-accent"}`}
        style={{
          width: size,
          height: size,
          top: "50%",
          left: "50%",
          x: "-50%",
          y: "-50%",
          filter: `blur(${Math.round(size * 0.38)}px)`,
        }}
        animate={
          state === "recording"
            ? { opacity: [0.35, 0.75, 0.35], scale: [1.1, 1.7, 1.1] }
            : state === "speaking"
              ? { opacity: [0.25, 0.6, 0.25], scale: [1.1, 1.55, 1.1] }
              : state === "thinking" || state === "transcribing"
                ? { opacity: [0.2, 0.45, 0.2], scale: [1.0, 1.35, 1.0] }
                : { opacity: 0.18, scale: 1.0 }
        }
        transition={
          state === "recording"
            ? { duration: 0.7, repeat: Infinity, ease: "easeInOut" }
            : state === "speaking"
              ? { duration: 0.5, repeat: Infinity, ease: "easeInOut" }
              : state === "thinking" || state === "transcribing"
                ? { duration: 1.1, repeat: Infinity, ease: "easeInOut" }
                : {}
        }
      />

      <motion.button
        type="button"
        onClick={onClick}
        style={{ width: size, height: size }}
        className={`
          absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          rounded-full flex items-center justify-center cursor-pointer
          shadow-2xl transition-colors duration-300
          ${isError ? "bg-red-500 shadow-red-500/40" : "bg-accent shadow-accent/50"}
        `}
        whileHover={isIdle ? { scale: 1.06 } : {}}
        whileTap={{ scale: 0.94 }}
        aria-label={
          state === "recording" ? "Stop recording" : "Start voice assistant"
        }
      >
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.28) 0%, transparent 65%)",
          }}
          animate={
            state === "thinking" || state === "transcribing"
              ? { opacity: [0.5, 1, 0.5] }
              : state === "speaking"
                ? { opacity: [0.4, 0.9, 0.4] }
                : { opacity: 1 }
          }
          transition={
            state === "thinking" || state === "transcribing"
              ? { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
              : state === "speaking"
                ? { duration: 0.45, repeat: Infinity, ease: "easeInOut" }
                : {}
          }
        />
        <OrbIcon state={state} />
      </motion.button>
    </div>
  );
}
