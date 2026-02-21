"use client";

import { Mic, MicOff, Loader2, Volume2 } from "lucide-react";
import type { VoiceRecorderState } from "@/hooks/use-voice-recorder";
import { trackEvent } from "@/lib/gtag";

export type VoiceButtonDisplayState =
  | VoiceRecorderState
  | "thinking"
  | "speaking";

interface VoiceButtonProps {
  displayState: VoiceButtonDisplayState;
  onStart: () => void;
  onStop: () => void;
  disabled?: boolean;
}

const config: Record<
  VoiceButtonDisplayState,
  { Icon: React.ElementType; label: string; className: string; spin?: boolean }
> = {
  idle: {
    Icon: Mic,
    label: "Start voice input",
    className: "text-muted hover:text-foreground hover:bg-foreground/5",
  },
  recording: {
    Icon: MicOff,
    label: "Stop recording",
    className: "text-red-500 bg-red-500/10 animate-pulse",
  },
  transcribing: {
    Icon: Loader2,
    label: "Transcribing…",
    className: "text-accent",
    spin: true,
  },
  thinking: {
    Icon: Loader2,
    label: "Thinking…",
    className: "text-accent",
    spin: true,
  },
  speaking: {
    Icon: Volume2,
    label: "Speaking…",
    className: "text-accent",
  },
  error: {
    Icon: Mic,
    label: "Try again",
    className: "text-red-400",
  },
};

export function VoiceButton({
  displayState,
  onStart,
  onStop,
  disabled,
}: VoiceButtonProps) {
  const { Icon, label, className, spin } = config[displayState];

  const isClickable =
    displayState === "idle" ||
    displayState === "recording" ||
    displayState === "error";
  const isDisabled = disabled || !isClickable;

  const handleClick = () => {
    if (displayState === "recording") onStop();
    else onStart();
    trackEvent("chat_voice_button_click", {
      event_category: "engagement",
      event_label: displayState === "recording" ? "voice_stop" : "voice_start",
      value: displayState === "recording" ? 0 : 1,
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      className={`flex items-center justify-center size-8 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
      aria-label={label}
      title={label}
    >
      <Icon className={`size-3.5 ${spin ? "animate-spin" : ""}`} />
    </button>
  );
}
