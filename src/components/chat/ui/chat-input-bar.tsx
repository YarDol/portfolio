"use client";

import { Send } from "lucide-react";
import { VoiceButton, type VoiceButtonDisplayState } from "@/components/chat/voice-button";

interface ChatInputBarProps {
  input: string;
  setInput: (v: string) => void;
  isWaiting: boolean;
  shakeInput: boolean;
  placeholder: string;
  voiceDisplayState: VoiceButtonDisplayState;
  isSupported: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onVoiceStart: () => void;
  onVoiceStop: () => void;
}

export function ChatInputBar({
  input,
  setInput,
  isWaiting,
  shakeInput,
  placeholder,
  voiceDisplayState,
  isSupported,
  onSubmit,
  onVoiceStart,
  onVoiceStop,
}: ChatInputBarProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex items-center gap-2 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] border-t border-border bg-card"
    >
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        className={`flex-1 bg-transparent text-sm text-foreground placeholder:text-muted outline-none transition-colors ${
          shakeInput ? "placeholder:text-red-400 animate-[shake_0.4s_ease-in-out]" : ""
        }`}
        disabled={isWaiting}
      />
      {isSupported && (
        <VoiceButton
          displayState={voiceDisplayState}
          onStart={onVoiceStart}
          onStop={onVoiceStop}
          disabled={isWaiting && voiceDisplayState === "idle"}
        />
      )}
      <button
        type="submit"
        disabled={isWaiting}
        className="flex items-center justify-center size-8 rounded-lg bg-accent text-white disabled:opacity-40 hover:bg-accent-light transition-colors cursor-pointer disabled:cursor-not-allowed"
        aria-label={placeholder}
      >
        <Send className="size-3.5" />
      </button>
    </form>
  );
}
