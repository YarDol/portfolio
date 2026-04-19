"use client";

import { useRef, useState } from "react";
import { useVoiceRecorder } from "@/hooks/use-voice-recorder";
import type { VoiceButtonDisplayState } from "@/components/chat/voice-button";

interface UseChatVoiceOptions {
  isWaiting: boolean;
  isTtsSpeaking: boolean;
  ttsStop: () => void;
  clearError: () => void;
  sendMessage: (msg: { text: string }) => void;
  onActivate: () => void;
  onDeactivate: () => void;
}

export function useChatVoice({
  isWaiting,
  isTtsSpeaking,
  ttsStop,
  clearError,
  sendMessage,
  onActivate,
  onDeactivate,
}: UseChatVoiceOptions) {
  const [isTtsActive, setIsTtsActive] = useState(false);
  const isTtsActiveRef = useRef(false);

  const activate = () => {
    isTtsActiveRef.current = true;
    setIsTtsActive(true);
    onActivate();
  };

  const deactivate = () => {
    isTtsActiveRef.current = false;
    setIsTtsActive(false);
    onDeactivate();
  };

  const { state, startRecording, stopRecording, isSupported } = useVoiceRecorder({
    onTranscript: (text) => {
      if (!text.trim()) return;
      ttsStop();
      activate();
      clearError();
      sendMessage({ text });
    },
    onError: deactivate,
  });

  const displayState: VoiceButtonDisplayState = (() => {
    if (state === "recording") return "recording";
    if (state === "transcribing") return "transcribing";
    if (state === "error") return "error";
    if (isWaiting && isTtsActive) return "thinking";
    if (isTtsSpeaking) return "speaking";
    return "idle";
  })();

  return { voiceState: state, startRecording, stopRecording, isSupported, displayState, isTtsActive, deactivate };
}
