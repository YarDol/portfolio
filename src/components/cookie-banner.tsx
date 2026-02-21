"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";
import { Cookie } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getConsent, setConsent } from "@/lib/consent";

export function CookieBanner() {
  const t = useTranslations("Cookies");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (getConsent() === null) {
        setVisible(true);
      }
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const handleAccept = () => {
    setConsent("accepted");
    setVisible(false);
    window.dispatchEvent(new Event("cookie-consent-accepted"));
  };

  const handleDecline = () => {
    setConsent("declined");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ type: "spring", stiffness: 340, damping: 30 }}
          className="fixed bottom-4 right-4 sm:bottom-4 sm:right-23 z-50 max-w-sm w-[calc(100%-2rem)] sm:w-auto"
        >
          <div className="flex flex-col gap-4 p-4 rounded-2xl bg-card/95 backdrop-blur-xl border border-border/60 shadow-xl shadow-black/10">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0 flex items-center justify-center size-8 rounded-full bg-accent/10">
                <Cookie className="size-4 text-accent" />
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {t("message")}{" "}
                <Link
                  href="/privacy"
                  className="underline underline-offset-4 hover:text-accent transition-colors"
                >
                  {t("learnMore")}
                </Link>
              </p>
            </div>

            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={handleDecline}
                className="text-sm px-4 py-1.5 rounded-full text-muted hover:text-foreground border border-border/50 hover:border-border transition-colors cursor-pointer"
              >
                {t("decline")}
              </button>
              <button
                onClick={handleAccept}
                className="text-sm px-4 py-1.5 rounded-full bg-accent text-accent-foreground hover:opacity-90 transition-opacity font-medium cursor-pointer"
              >
                {t("accept")}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
