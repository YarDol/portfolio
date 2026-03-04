"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  startTransition,
} from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion, AnimatePresence, useInView } from "motion/react";
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
  ArrowUpRight,
} from "lucide-react";
import { trackEvent } from "@/lib/gtag";
import dynamic from "next/dynamic";

const ContactBg = dynamic(
  () => import("./contact/contact-bg").then((m) => m.ContactBg),
  { ssr: false },
);

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

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string | null;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block font-mono text-[10px] tracking-widest text-muted/50 uppercase select-none"
      >
        {label}
      </label>
      <div className="group rounded-xl border border-border/60 bg-foreground/3 transition-colors focus-within:border-accent/50 focus-within:bg-foreground/5">
        {children}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1.5 text-xs text-red-500"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Contact() {
  const t = useTranslations("Contact");
  const [state, action, isPending] = useActionState(
    sendContactForm,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [consented, setConsented] = useState(false);
  const [consentTouched, setConsentTouched] = useState(false);

  function fieldError(key: string | undefined) {
    if (!key || !errorMap[key]) return null;
    return t(errorMap[key]);
  }

  useEffect(() => {
    if (!state.success) return;
    formRef.current?.reset();
    queueMicrotask(() => {
      setConsented(false);
      setConsentTouched(false);
    });
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
    startTransition(() => {
      action(formData);
    });
    formRef.current?.reset();
  };

  const inputClass =
    "w-full bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted/40 outline-none";

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    transition: {
      duration: 0.5,
      delay,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  });

  return (
    <section
      id="contact"
      className="relative border-t border-border py-24 overflow-hidden"
      ref={sectionRef}
    >
      <ContactBg />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-10">
          <motion.p
            {...fadeUp(0)}
            className="font-mono text-xs tracking-widest text-accent uppercase mb-3"
          >
            {t("label")}
          </motion.p>
          <motion.h2
            {...fadeUp(0.06)}
            className="text-3xl font-bold tracking-tight sm:text-4xl mb-4"
          >
            {t("title")}
          </motion.h2>
          <motion.a
            {...fadeUp(0.12)}
            href={`mailto:${siteConfig.email}`}
            className="group inline-flex items-center gap-2 text-muted hover:text-foreground transition-colors"
          >
            <span className="text-sm">{siteConfig.email}</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </motion.a>
        </div>

        <div className="grid gap-14 md:grid-cols-5">
          <motion.div {...fadeUp(0.2)} className="md:col-span-3">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  id="name"
                  label={t("name")}
                  error={fieldError(state.fieldErrors?.name)}
                >
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder={t("namePlaceholder")}
                    className={inputClass}
                  />
                </Field>

                <Field
                  id="email"
                  label={t("email")}
                  error={fieldError(state.fieldErrors?.email)}
                >
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={t("emailPlaceholder")}
                    className={inputClass}
                  />
                </Field>
              </div>

              <Field
                id="message"
                label={t("message")}
                error={fieldError(state.fieldErrors?.message)}
              >
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  placeholder={t("messagePlaceholder")}
                  className={`${inputClass} resize-none`}
                />
              </Field>

              <div className="space-y-1 pt-1">
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
                    <div className="size-4 rounded border border-border/60 bg-transparent transition-colors peer-checked:border-accent peer-checked:bg-accent group-hover:border-accent/50" />
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
                  <span className="text-xs text-muted/70 leading-relaxed">
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

              <div className="pt-1">
                <motion.button
                  type="submit"
                  disabled={isPending}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 rounded-xl bg-foreground px-7 py-3 text-sm font-medium text-background transition-opacity disabled:opacity-50 hover:opacity-85"
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
                        className="inline-block h-4 w-4 rounded-full border-2 border-background/30 border-t-background"
                      />
                      {t("sending")}
                    </>
                  ) : (
                    <>
                      {t("send")}
                      <Send className="h-3.5 w-3.5" />
                    </>
                  )}
                </motion.button>
              </div>

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
          </motion.div>

          <div className="md:col-span-2 flex flex-col gap-8 md:pt-4">
            <motion.div {...fadeUp(0.18)} className="flex items-start gap-3">
              <span className="relative flex h-4 w-4 shrink-0 items-center justify-center mt-1">
                <span className="absolute inset-0 rounded-full border border-border transition-colors duration-200 group-hover:border-accent/50" />
                <span className="h-1.5 w-1.5 rounded-full bg-accent/40 transition-all duration-200 group-hover:bg-accent group-hover:scale-125" />
              </span>
              <p className="text-sm text-muted leading-relaxed hover:text-foreground group">
                {t("availability")}
              </p>
            </motion.div>

            <motion.div
              initial={{ scaleX: 0, originX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.5, delay: 0.22 }}
              className="h-px bg-border/60"
            />

            <div className="space-y-4">
              {[
                {
                  href: `mailto:${siteConfig.email}`,
                  icon: Mail,
                  text: siteConfig.email,
                  delay: 0.25,
                },
                {
                  href: `tel:${siteConfig.phone.replace(/\s/g, "")}`,
                  icon: Phone,
                  text: siteConfig.phone,
                  delay: 0.3,
                },
              ].map(({ href, icon: Icon, text, delay }) => (
                <motion.a
                  key={text}
                  href={href}
                  {...fadeUp(delay)}
                  className="flex items-center gap-3 text-sm text-muted transition-colors hover:text-foreground group"
                >
                  <Icon className="h-4 w-4 shrink-0 transition-colors group-hover:text-accent" />
                  {text}
                </motion.a>
              ))}
              <motion.div
                {...fadeUp(0.35)}
                className="flex items-center gap-3 text-sm text-muted"
              >
                <MapPin className="h-4 w-4 shrink-0" />
                {t("based")}
              </motion.div>
            </div>

            <motion.div {...fadeUp(0.4)} className="flex gap-2">
              {[
                {
                  href: siteConfig.links.github,
                  icon: Github,
                  label: "GitHub",
                },
                {
                  href: siteConfig.links.linkedin,
                  icon: Linkedin,
                  label: "LinkedIn",
                },
              ].map(({ href, icon: Icon, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.93 }}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 text-muted transition-colors hover:border-accent/60 hover:text-accent"
                  aria-label={label}
                >
                  <Icon className="h-3.5 w-3.5" />
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
