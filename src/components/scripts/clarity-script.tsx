"use client";

import { useEffect, useState } from "react";
import { getConsent } from "@/lib/consent";

const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

export function ClarityScript() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (getConsent() === "accepted") {
      requestAnimationFrame(() => {
        setEnabled(true);
      });
    }

    const handler = () => {
      if (getConsent() === "accepted") {
        setEnabled(true);
      }
    };

    window.addEventListener("cookie-consent-accepted", handler);
    return () => window.removeEventListener("cookie-consent-accepted", handler);
  }, []);

  useEffect(() => {
    if (!enabled || !CLARITY_ID || typeof document === "undefined") return;

    const script = document.createElement("script");
    script.id = "microsoft-clarity";
    script.async = true;
    script.textContent = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`;

    document.head.appendChild(script);
    return () => script.remove();
  }, [enabled]);

  return null;
}
