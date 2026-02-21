"use client";

import {
  motion,
  useTransform,
  type MotionValue,
  type Transition,
} from "motion/react";
import type { VoiceChatState } from "@/hooks/use-voice-chat";

interface VoiceOrbProps {
  state: VoiceChatState;
  audioLevel: MotionValue<number>;
  onClick?: () => void;
  size?: number;
}

function OrbIcon({ state }: { state: VoiceChatState }) {
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

interface RingProps {
  multiplier: number;
  orbSize: number;
  audioLevel: MotionValue<number>;
  audioGain: number;
  state: VoiceChatState;
  delay?: number;
  opacity?: string;
}

function Ring({
  multiplier,
  orbSize,
  audioLevel,
  audioGain,
  state,
  delay = 0,
  opacity = "border-accent/30",
}: RingProps) {
  const mvScale = useTransform(
    audioLevel,
    [0, 1],
    [multiplier, multiplier + audioGain],
  );

  const isRecording = state === "recording";
  const isSpeaking = state === "speaking";
  const isThinking = state === "thinking" || state === "transcribing";
  const isIdle = state === "idle" || state === "error" || state === "quota";

  const sharedStyle = {
    width: orbSize,
    height: orbSize,
    top: "50%",
    left: "50%",
    x: "-50%",
    y: "-50%",
  } as const;

  if (isRecording) {
    return (
      <motion.div
        className={`absolute rounded-full border ${opacity} pointer-events-none`}
        style={{ ...sharedStyle, scale: mvScale }}
      />
    );
  }

  const animate = isSpeaking
    ? {
        scale: [multiplier, multiplier + audioGain * 0.7, multiplier],
        opacity: [0.5, 0.9, 0.5],
      }
    : isThinking
      ? {
          scale: [multiplier, multiplier + audioGain * 0.4, multiplier],
          opacity: [0.3, 0.65, 0.3],
        }
      : isIdle
        ? {
            scale: [multiplier, multiplier + audioGain * 0.2, multiplier],
            opacity: [0.2, 0.45, 0.2],
          }
        : undefined;

  const transition: Transition = isSpeaking
    ? {
        duration: 0.5 + delay * 0.3,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }
    : isThinking
      ? { duration: 1.1, repeat: Infinity, ease: "easeInOut", delay }
      : { duration: 2.5 + delay, repeat: Infinity, ease: "easeInOut", delay };

  return (
    <motion.div
      className={`absolute rounded-full border ${opacity} pointer-events-none`}
      style={{ ...sharedStyle, scale: multiplier }}
      animate={animate}
      transition={transition}
    />
  );
}

export function VoiceOrb({
  state,
  audioLevel,
  onClick,
  size = 96,
}: VoiceOrbProps) {
  const isError = state === "error" || state === "quota" || state === "disabled";
  const isIdle = state === "idle" || state === "error" || state === "quota" || state === "disabled";

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
