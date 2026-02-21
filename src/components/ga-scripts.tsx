"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { getConsent } from "@/lib/consent";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export function GaScripts() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    if (getConsent() === "accepted") {
      setConsented(true);
    }

    const handler = () => {
      if (getConsent() === "accepted") setConsented(true);
    };
    window.addEventListener("cookie-consent-accepted", handler);
    return () => window.removeEventListener("cookie-consent-accepted", handler);
  }, []);

  if (!consented || !GA_ID) return null;

  return (
    <>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
