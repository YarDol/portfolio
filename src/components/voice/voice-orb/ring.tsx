"use client";

import { motion, useTransform, type MotionValue, type Transition } from "motion/react";
import type { VoiceChatState } from "@/hooks/use-voice-chat";

interface RingProps {
  multiplier: number;
  orbSize: number;
  audioLevel: MotionValue<number>;
  audioGain: number;
  state: VoiceChatState;
  delay?: number;
  opacity?: string;
}

export function Ring({
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
    ? { scale: [multiplier, multiplier + audioGain * 0.7, multiplier], opacity: [0.5, 0.9, 0.5] }
    : isThinking
      ? { scale: [multiplier, multiplier + audioGain * 0.4, multiplier], opacity: [0.3, 0.65, 0.3] }
      : isIdle
        ? { scale: [multiplier, multiplier + audioGain * 0.2, multiplier], opacity: [0.2, 0.45, 0.2] }
        : undefined;

  const transition: Transition = isSpeaking
    ? { duration: 0.5 + delay * 0.3, repeat: Infinity, ease: "easeInOut", delay }
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
