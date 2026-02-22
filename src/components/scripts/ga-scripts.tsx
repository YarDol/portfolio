"use client";

import { useEffect } from "react";
import Script from "next/script";
import { getConsent } from "@/lib/consent";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

function grantConsent() {
  window.gtag?.("consent", "update", {
    analytics_storage: "granted",
    ad_storage: "granted",
  });
}

export function GaScripts() {
  useEffect(() => {
    if (getConsent() === "accepted") {
      grantConsent();
    }

    window.addEventListener("cookie-consent-accepted", grantConsent);
    return () =>
      window.removeEventListener("cookie-consent-accepted", grantConsent);
  }, []);

  if (!GA_ID) return null;

  return (
    <>
      <Script id="consent-default" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            wait_for_update: 500
          });
          gtag('js', new Date());
        `}
      </Script>

      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />

      <Script id="google-analytics" strategy="afterInteractive">
        {`gtag('config', '${GA_ID}');`}
      </Script>
    </>
  );
}
