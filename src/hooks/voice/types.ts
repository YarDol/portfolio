export type VoiceChatState =
  | "idle"
  | "recording"
  | "transcribing"
  | "thinking"
  | "speaking"
  | "error"
  | "quota"
  | "disabled";

export type TtsEngine = "browser" | "elevenlabs";

export interface ConversationTurn {
  user: string;
  assistant: string;
}

export interface UseVoiceChatOptions {
  locale?: string;
  silenceTimeout?: number;
  ttsEngine?: TtsEngine;
  disabled?: boolean;
}
