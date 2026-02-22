export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

type GTagCommand = "config" | "event" | "js" | "consent" | "set";

interface GTagParams {
  [key: string]: string | number | boolean | undefined;
}

declare global {
  interface Window {
    gtag: (
      command: GTagCommand,
      targetIdOrEventName: string | Date,
      params?: GTagParams,
    ) => void;
  }
}

export const trackEvent = (eventName: string, params?: GTagParams) => {
  if (typeof window === "undefined") return;
  if (!window.gtag) return;

  window.gtag("event", eventName, params);
};
