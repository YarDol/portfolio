"use client";

import {
  useActionState,
  useEffect,
  useRef,
  startTransition,
} from "react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "motion/react";
import { sendContactForm } from "@/app/actions/contact";
import { siteConfig } from "@/lib/constants";
import { Mail, Phone, Github, Linkedin, Instagram } from "lucide-react";
import { trackEvent } from "@/lib/gtag";
import dynamic from "next/dynamic";

import { initialState, errorMap } from "./contact/constants";
import { fadeUp, inputClass } from "./contact/lib/animations";
import { Field } from "./contact/field";
import { ContactHeader } from "./contact/contact-header";
import { ConsentCheckbox, type ConsentCheckboxRef } from "./contact/consent-checkbox";
import { SubmitButton } from "./contact/submit-button";
import { FormStatus } from "./contact/form-status";
import { ContactSidebar } from "./contact/sidebar";

const ContactBg = dynamic(
  () => import("./contact/contact-bg").then((m) => m.ContactBg),
  { ssr: false },
);

const contactLinks = (email: string, phone: string) => [
  { href: `mailto:${email}`, icon: Mail, text: email, delay: 0.25 },
  { href: `tel:${phone.replace(/\s/g, "")}`, icon: Phone, text: phone, delay: 0.3 },
];

const socialLinks = [
  { href: siteConfig.links.github, icon: Github, label: "GitHub" },
  { href: siteConfig.links.linkedin, icon: Linkedin, label: "LinkedIn" },
  { href: siteConfig.links.instagram, icon: Instagram, label: "Instagram" },
];

export function Contact() {
  const t = useTranslations("Contact");
  const [state, action, isPending] = useActionState(sendContactForm, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const consentRef = useRef<ConsentCheckboxRef>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  function fieldError(key: string | undefined) {
    if (!key || !errorMap[key]) return null;
    return t(errorMap[key]);
  }

  useEffect(() => {
    if (!state.success) return;
    formRef.current?.reset();
    queueMicrotask(() => { consentRef.current?.reset(); });
  }, [state.success]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending) return;
    consentRef.current?.touch();
    if (!consentRef.current?.isConsented()) return;
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;
    trackEvent("contact_form_submit", {
      event_category: "conversion",
      event_label: "contact_form_submit",
      value: name.length + email.length + message.length,
    });
    startTransition(() => { action(formData); });
    formRef.current?.reset();
  };

  const fu = (delay: number) => fadeUp(isInView, delay);

  return (
    <section
      id="contact"
      className="relative border-t border-border py-24 overflow-hidden"
      ref={sectionRef}
    >
      <ContactBg />

      <div className="relative mx-auto max-w-6xl px-6">
        <ContactHeader
          label={t("label")}
          title={t("title")}
          email={siteConfig.email}
          fadeUp={fu}
        />

        <div className="grid gap-14 md:grid-cols-5">
          <motion.div {...fu(0.2)} className="md:col-span-3">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="name" label={t("name")} error={fieldError(state.fieldErrors?.name)}>
                  <input id="name" name="name" type="text" placeholder={t("namePlaceholder")} className={inputClass} />
                </Field>
                <Field id="email" label={t("email")} error={fieldError(state.fieldErrors?.email)}>
                  <input id="email" name="email" type="email" placeholder={t("emailPlaceholder")} className={inputClass} />
                </Field>
              </div>

              <Field id="message" label={t("message")} error={fieldError(state.fieldErrors?.message)}>
                <textarea id="message" name="message" rows={6} placeholder={t("messagePlaceholder")} className={`${inputClass} resize-none`} />
              </Field>

              <ConsentCheckbox
                ref={consentRef}
                consentBefore={t("consentBefore")}
                consentLink={t("consentLink")}
                consentAfter={t("consentAfter")}
                consentRequired={t("consentRequired")}
              />

              <SubmitButton isPending={isPending} sendLabel={t("send")} sendingLabel={t("sending")} />

              <FormStatus
                success={state.success}
                error={!!state.error}
                successMessage={t("success")}
                errorMessage={t("error")}
              />
            </form>
          </motion.div>

          <ContactSidebar
            availability={t("availability")}
            based={t("based")}
            email={siteConfig.email}
            phone={siteConfig.phone}
            contactLinks={contactLinks(siteConfig.email, siteConfig.phone)}
            socialLinks={socialLinks}
            fadeUp={fu}
            isInView={isInView}
          />
        </div>
      </div>
    </section>
  );
}
