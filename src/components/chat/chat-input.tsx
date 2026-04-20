"use client";

import type { RefObject } from "react";
import { Send } from "lucide-react";
import { VoiceButton, type VoiceButtonDisplayState } from "@/components/chat/voice-button";

interface ChatInputProps {
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isWaiting: boolean;
  shakeInput: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  voiceDisplayState: VoiceButtonDisplayState;
  isVoiceSupported: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  placeholder: string;
  submitLabel: string;
}

export function ChatInput({
  input,
  onInputChange,
  onSubmit,
  isWaiting,
  shakeInput,
  inputRef,
  voiceDisplayState,
  isVoiceSupported,
  startRecording,
  stopRecording,
  placeholder,
  submitLabel,
}: ChatInputProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex items-center gap-2 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] border-t border-border bg-card"
    >
      <input
        ref={inputRef}
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder={placeholder}
        className={`flex-1 bg-transparent text-sm text-foreground placeholder:text-muted outline-none transition-colors ${
          shakeInput ? "placeholder:text-red-400 animate-[shake_0.4s_ease-in-out]" : ""
        }`}
        disabled={isWaiting}
      />
      {isVoiceSupported && (
        <VoiceButton
          displayState={voiceDisplayState}
          onStart={startRecording}
          onStop={stopRecording}
          disabled={isWaiting && voiceDisplayState === "idle"}
        />
      )}
      <button
        type="submit"
        disabled={isWaiting}
        className="flex items-center justify-center size-8 rounded-lg bg-accent text-white disabled:opacity-40 hover:bg-accent-light transition-colors cursor-pointer disabled:cursor-not-allowed"
        aria-label={submitLabel}
      >
        <Send className="size-3.5" />
      </button>
    </form>
  );
}
