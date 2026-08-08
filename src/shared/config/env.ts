export const IS_PRODUCTION = process.env.NODE_ENV === "production";

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
export const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

export const VOICE_DISABLED = process.env.NEXT_PUBLIC_VOICE_DISABLED === "true";

export const VOICE_LLM_DISABLED =
  process.env.NEXT_PUBLIC_VOICE_LLM_DISABLED === "true";

export const VOICE_ELEVENLABS_DISABLED =
  process.env.NEXT_PUBLIC_VOICE_ELEVENLABS_DISABLED === "true";
