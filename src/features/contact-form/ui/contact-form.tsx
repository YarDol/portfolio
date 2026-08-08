"use client";

import { useActionState, useEffect, useRef, startTransition } from "react";
import { useTranslations } from "next-intl";
import { trackEvent } from "@/shared/lib/analytics";
import { sendContactForm } from "../api/send-contact-form";
import { initialState, errorMap } from "../model/constants";
import { Field } from "./field";
import { ConsentCheckbox, type ConsentCheckboxRef } from "./consent-checkbox";
import { SubmitButton } from "./submit-button";
import { FormStatus } from "./form-status";

const inputClass =
  "w-full bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted/40 outline-none";

export function ContactForm() {
  const t = useTranslations("Contact");
  const [state, action, isPending] = useActionState(
    sendContactForm,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const consentRef = useRef<ConsentCheckboxRef>(null);

  function fieldError(key: string | undefined) {
    if (!key || !errorMap[key]) return null;
    return t(errorMap[key]);
  }

  useEffect(() => {
    if (!state.success) return;
    formRef.current?.reset();
    queueMicrotask(() => {
      consentRef.current?.reset();
    });
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

    startTransition(() => {
      action(formData);
    });
    formRef.current?.reset();
  };

  return (
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

      <ConsentCheckbox
        ref={consentRef}
        consentBefore={t("consentBefore")}
        consentLink={t("consentLink")}
        consentAfter={t("consentAfter")}
        consentRequired={t("consentRequired")}
      />

      <SubmitButton
        isPending={isPending}
        sendLabel={t("send")}
        sendingLabel={t("sending")}
      />

      <FormStatus
        success={state.success}
        error={!!state.error}
        successMessage={t("success")}
        errorMessage={t("error")}
      />
    </form>
  );
}
