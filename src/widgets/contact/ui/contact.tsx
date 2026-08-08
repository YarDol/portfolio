"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "motion/react";
import dynamic from "next/dynamic";
import { siteConfig } from "@/shared/config";
import { ContactForm } from "@/features/contact-form";
import { createFadeUp } from "../lib/fade-up";
import { contactLinks, socialLinks } from "../config/links";
import { ContactHeader } from "./contact-header";
import { ContactSidebar } from "./contact-sidebar";

const ContactBg = dynamic(() => import("./contact-bg").then((m) => m.ContactBg), {
  ssr: false,
});

export function Contact() {
  const t = useTranslations("Contact");
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const fadeUp = createFadeUp(isInView);

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
          fadeUp={fadeUp}
        />

        <div className="grid gap-14 md:grid-cols-5">
          <motion.div {...fadeUp(0.2)} className="md:col-span-3">
            <ContactForm />
          </motion.div>

          <ContactSidebar
            availability={t("availability")}
            based={t("based")}
            contactLinks={contactLinks}
            socialLinks={socialLinks}
            fadeUp={fadeUp}
            isInView={isInView}
          />
        </div>
      </div>
    </section>
  );
}
