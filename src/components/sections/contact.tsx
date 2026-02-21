"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion, AnimatePresence } from "motion/react";
import { SectionHeading } from "@/components/ui/section-heading";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { sendContactForm, type ContactState } from "@/app/actions/contact";
import { siteConfig } from "@/lib/constants";
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { trackEvent } from "@/lib/gtag";

const initialState: ContactState = { success: false };

const errorMap: Record<
  string,
  "nameRequired" | "emailRequired" | "emailInvalid" | "messageRequired"
> = {
  nameRequired: "nameRequired",
  emailRequired: "emailRequired",
  emailInvalid: "emailInvalid",
  messageRequired: "messageRequired",
};

export function Contact() {
  const t = useTranslations("Contact");
  const [state, action, isPending] = useActionState(
    sendContactForm,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [consented, setConsented] = useState(false);
  const [consentTouched, setConsentTouched] = useState(false);

  function fieldError(key: string | undefined) {
    if (!key || !errorMap[key]) return null;
    return t(errorMap[key]);
  }

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      setConsented(false);
      setConsentTouched(false);
    }
  }, [state.success]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending) return;
    setConsentTouched(true);
    if (!consented) return;
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;
    trackEvent("contact_form_submit", {
      event_category: "conversion",
      event_label: "contact_form_submit",
      value: name.length + email.length + message.length,
    });
    action(formData);
    formRef.current?.reset();
  };

  return (
    <section id="contact" className="border-t border-border py-24">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          label={t("label")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <div className="grid gap-12 md:grid-cols-5">
          <ScrollReveal className="md:col-span-3">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-sm font-medium"
                >
                  {t("name")}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder={t("namePlaceholder")}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted outline-none transition-colors focus:border-accent"
                />
                {state.fieldErrors?.name && (
                  <p className="mt-1 text-xs text-red-500">
                    {fieldError(state.fieldErrors.name)}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium"
                >
                  {t("email")}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted outline-none transition-colors focus:border-accent"
                />
                {state.fieldErrors?.email && (
                  <p className="mt-1 text-xs text-red-500">
                    {fieldError(state.fieldErrors.email)}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-1.5 block text-sm font-medium"
                >
                  {t("message")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder={t("messagePlaceholder")}
                  className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted outline-none transition-colors focus:border-accent"
                />
                {state.fieldErrors?.message && (
                  <p className="mt-1 text-xs text-red-500">
                    {fieldError(state.fieldErrors.message)}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative mt-0.5 shrink-0">
                    <input
                      type="checkbox"
                      checked={consented}
                      onChange={(e) => {
                        setConsented(e.target.checked);
                        setConsentTouched(true);
                      }}
                      className="sr-only peer"
                    />
                    <div className="size-4 rounded border border-border bg-background transition-colors peer-checked:border-accent peer-checked:bg-accent group-hover:border-accent/60" />
                    {consented && (
                      <svg
                        className="absolute inset-0 m-auto size-2.5 text-white pointer-events-none"
                        viewBox="0 0 12 10"
                        fill="none"
                      >
                        <path
                          d="M1 5l3.5 3.5L11 1"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="text-xs text-muted leading-relaxed">
                    {t("consentBefore")}
                    <Link
                      href="/privacy"
                      className="underline underline-offset-2 hover:text-accent transition-colors"
                    >
                      {t("consentLink")}
                    </Link>
                    {t("consentAfter")}
                  </span>
                </label>
                {consentTouched && !consented && (
                  <p className="text-xs text-red-500 pl-7">
                    {t("consentRequired")}
                  </p>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={isPending}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-medium text-white transition-opacity disabled:opacity-60"
              >
                {isPending ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                    />
                    {t("sending")}
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    {t("send")}
                  </>
                )}
              </motion.button>

              <AnimatePresence mode="wait">
                {state.success && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400"
                  >
                    <CheckCircle className="h-4 w-4 shrink-0" />
                    {t("success")}
                  </motion.div>
                )}
                {state.error && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {t("error")}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </ScrollReveal>

          <ScrollReveal delay={0.2} className="md:col-span-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="mb-4 font-mono text-sm font-medium tracking-wide text-accent uppercase">
                {t("orReachOut")}
              </h3>

              <div className="space-y-4">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-3 text-sm text-muted transition-colors hover:text-accent"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  {siteConfig.email}
                </a>

                <a
                  href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 text-sm text-muted transition-colors hover:text-accent"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  {siteConfig.phone}
                </a>

                <div className="flex items-center gap-3 text-sm text-muted">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <div>
                    <p>{t("based")}</p>
                    <p className="text-xs text-accent/70">
                      {t("availability")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3 border-t border-border pt-6">
                <a
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-muted transition-colors hover:border-accent hover:text-accent"
                >
                  <Github className="h-4 w-4" />
                </a>
                <a
                  href={siteConfig.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-muted transition-colors hover:border-accent hover:text-accent"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-muted transition-colors hover:border-accent hover:text-accent"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
