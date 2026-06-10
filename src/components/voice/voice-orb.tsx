"use client";

import {
  motion,
  useTransform,
  type MotionValue,
  type Transition,
} from "motion/react";
import type { VoiceChatState } from "@/hooks/use-voice-chat";

function OrbIcon({ state }: { state: VoiceChatState }) {
  if (state === "transcribing" || state === "thinking") {
    return (
      <div className="flex items-end gap-1 h-6" aria-hidden>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-0.75 bg-background rounded-full"
            animate={{ height: ["6px", "22px", "6px"] }}
            transition={{ duration: 0.65, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
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
            className="w-0.75 bg-background rounded-full"
            animate={{ height: ["4px", i % 2 === 0 ? "22px" : "14px", "4px"] }}
            transition={{ duration: 0.45, repeat: Infinity, ease: "easeInOut", delay: i * 0.08 }}
          />
        ))}
      </div>
    );
  }
  if (state === "recording") {
    return (
      <motion.span
        className="block size-5 rounded-full bg-background"
        animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />
    );
  }
  if (state === "error" || state === "quota" || state === "disabled") {
    return (
      <span className="text-background text-2xl font-light select-none" aria-hidden>
        {state === "disabled" ? "×" : "!"}
      </span>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="size-9 fill-background" aria-hidden>
      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
      <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
    </svg>
  );
}

// Audio-reactive circular pulse ring (restored behaviour from original)
function PulseRing({
  multiplier,
  orbSize,
  audioLevel,
  audioGain,
  state,
  delay = 0,
  borderClass = "border-foreground/20",
}: {
  multiplier: number;
  orbSize: number;
  audioLevel: MotionValue<number>;
  audioGain: number;
  state: VoiceChatState;
  delay?: number;
  borderClass?: string;
}) {
  const mvScale = useTransform(audioLevel, [0, 1], [multiplier, multiplier + audioGain]);

  const isRecording = state === "recording";
  const isSpeaking = state === "speaking";
  const isThinking = state === "thinking" || state === "transcribing";

  const sharedStyle = {
    width: orbSize,
    height: orbSize,
    top: "50%",
    left: "50%",
    marginTop: -orbSize / 2,
    marginLeft: -orbSize / 2,
  } as const;

  if (isRecording) {
    return (
      <motion.div
        className={`absolute rounded-full border ${borderClass} pointer-events-none`}
        style={{ ...sharedStyle, scale: mvScale }}
      />
    );
  }

  const animate = isSpeaking
    ? { scale: [multiplier, multiplier + audioGain * 0.7, multiplier], opacity: [0.55, 0.9, 0.55] }
    : isThinking
      ? { scale: [multiplier, multiplier + audioGain * 0.35, multiplier], opacity: [0.35, 0.6, 0.35] }
      : { scale: [multiplier, multiplier + audioGain * 0.15, multiplier], opacity: [0.18, 0.38, 0.18] };

  const transition: Transition = isSpeaking
    ? { duration: 0.55 + delay * 0.25, repeat: Infinity, ease: "easeInOut", delay }
    : isThinking
      ? { duration: 1.2, repeat: Infinity, ease: "easeInOut", delay }
      : { duration: 2.8 + delay, repeat: Infinity, ease: "easeInOut", delay };

  return (
    <motion.div
      className={`absolute rounded-full border ${borderClass} pointer-events-none`}
      style={{ ...sharedStyle, scale: multiplier }}
      animate={animate}
      transition={transition}
    />
  );
}

// Tilted elliptical ring — appears to orbit around the sphere like a planetary ring.
// Positioned behind the orb (z-1) so the solid sphere eclipses the center of the ellipse,
// leaving two arcs peeking out on each side.
function OrbitalRing({
  orbSize,
  widthFactor,
  heightFactor,
  rotateDeg,
  borderClass,
  state,
  duration = 4,
  delay = 0,
}: {
  orbSize: number;
  widthFactor: number;
  heightFactor: number;
  rotateDeg: number;
  borderClass: string;
  state: VoiceChatState;
  duration?: number;
  delay?: number;
}) {
  const w = orbSize * widthFactor;
  const h = orbSize * heightFactor;
  const isActive =
    state !== "idle" && state !== "error" && state !== "quota" && state !== "disabled";

  return (
    <motion.div
      className={`absolute rounded-full border pointer-events-none ${borderClass}`}
      style={{
        width: w,
        height: h,
        top: "50%",
        left: "50%",
        marginTop: -h / 2,
        marginLeft: -w / 2,
        rotate: rotateDeg,
      }}
      animate={{
        opacity: isActive ? [0.45, 0.7, 0.45] : [0.15, 0.28, 0.15],
      }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

export function VoiceOrb({
  state,
  audioLevel,
  onClick,
  size = 96,
}: {
  state: VoiceChatState;
  audioLevel: MotionValue<number>;
  onClick?: () => void;
  size?: number;
}) {
  const isError = state === "error" || state === "quota" || state === "disabled";
  const isIdle =
    state === "idle" || state === "error" || state === "quota" || state === "disabled";

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size * 3.6, height: size * 3.6 }}
    >
      {/* ── Orbital rings — z-1, behind the sphere ───────────────────────── */}
      {!isError && (
        <>
          {/* Inner orbital: steeper tilt, arcs visible on left/right */}
          <OrbitalRing
            orbSize={size}
            widthFactor={2.15}
            heightFactor={0.72}
            rotateDeg={-28}
            borderClass="border-foreground/22"
            state={state}
            duration={4.5}
            delay={0}
          />
          {/* Outer orbital: shallower tilt, more of the ellipse is visible */}
          <OrbitalRing
            orbSize={size}
            widthFactor={2.75}
            heightFactor={1.08}
            rotateDeg={22}
            borderClass="border-foreground/12"
            state={state}
            duration={5.5}
            delay={0.8}
          />
        </>
      )}

      {/* ── Audio-reactive pulse rings ────────────────────────────────────── */}
      <PulseRing
        multiplier={1.55}
        orbSize={size}
        audioLevel={audioLevel}
        audioGain={0.55}
        state={state}
        delay={0.1}
        borderClass="border-foreground/18"
      />
      <PulseRing
        multiplier={1.28}
        orbSize={size}
        audioLevel={audioLevel}
        audioGain={0.38}
        state={state}
        delay={0}
        borderClass="border-foreground/30"
      />

      {/* ── Ambient glow ──────────────────────────────────────────────────── */}
      {!isError && (
        <motion.div
          className="absolute rounded-full bg-foreground pointer-events-none"
          style={{
            width: size,
            height: size,
            top: "50%",
            left: "50%",
            marginTop: -size / 2,
            marginLeft: -size / 2,
            filter: `blur(${Math.round(size * 0.42)}px)`,
          }}
          animate={
            state === "recording"
              ? { opacity: [0.4, 0.78, 0.4], scale: [1.1, 1.65, 1.1] }
              : state === "speaking"
                ? { opacity: [0.28, 0.62, 0.28], scale: [1.1, 1.5, 1.1] }
                : state === "thinking" || state === "transcribing"
                  ? { opacity: [0.2, 0.44, 0.2], scale: [1.0, 1.32, 1.0] }
                  : { opacity: 0.16, scale: 1.0 }
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
      )}

      {isError && (
        <motion.div
          className="absolute rounded-full bg-red-500 pointer-events-none"
          style={{
            width: size,
            height: size,
            top: "50%",
            left: "50%",
            marginTop: -size / 2,
            marginLeft: -size / 2,
            filter: `blur(${Math.round(size * 0.35)}px)`,
          }}
          animate={{ opacity: [0.35, 0.6, 0.35], scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* ── Main sphere — z-10, eclipses the orbital ring centres ─────────── */}
      <motion.button
        type="button"
        onClick={onClick}
        style={{ width: size, height: size }}
        className={`
          absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          rounded-full flex items-center justify-center cursor-pointer
          shadow-2xl z-10 overflow-hidden
          ${isError ? "bg-red-500 shadow-red-500/30" : "bg-foreground shadow-foreground/20"}
        `}
        whileHover={isIdle ? { scale: 1.06 } : {}}
        whileTap={{ scale: 0.94 }}
        aria-label={state === "recording" ? "Stop recording" : "Start voice assistant"}
      >
        {/* ─ 3-D sphere shading ──────────────────────────────────────────── */}

        {/* Rim shadow: darkens the outer edge so the sphere reads as convex */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, transparent 52%, rgba(0,0,0,0.42) 100%)",
            mixBlendMode: "multiply",
          }}
        />

        {/* Shadow hemisphere: darkens the bottom-right quarter */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 65% 68%, rgba(0,0,0,0.34) 0%, transparent 58%)",
            mixBlendMode: "multiply",
          }}
        />

        {/* Specular wash: broad highlight on the top-left half */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 33% 28%, rgba(255,255,255,0.52) 0%, transparent 46%)",
            mixBlendMode: "overlay",
          }}
        />

        {/* Specular glint: tiny bright point — the "sparkle" on a glass ball */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: "22%",
            height: "14%",
            left: "21%",
            top: "15%",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.72)",
            filter: "blur(3px)",
            mixBlendMode: "overlay",
          }}
        />

        <OrbIcon state={state} />
      </motion.button>
    </div>
  );
}
