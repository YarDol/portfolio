"use client";

import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/ui/section-heading";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const highlights = [
  { key: "experience", labelKey: "experienceLabel" },
  { key: "apps", labelKey: "appsLabel" },
  { key: "users", labelKey: "usersLabel" },
  { key: "education", labelKey: "educationLabel" },
] as const;

export function About() {
  const t = useTranslations("About");

  return (
    <section id="about" className="py-24">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          label={t("label")}
          title={t("title")}
          subtitle={t("description")}
        />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {highlights.map(({ key, labelKey }, i) => (
            <ScrollReveal key={key} delay={i * 0.1}>
              <div className="rounded-2xl border border-border bg-card p-6 text-center">
                <p className="text-3xl font-bold text-accent">
                  {t(`highlights.${key}`)}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {t(`highlights.${labelKey}`)}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <ScrollReveal delay={0.1}>
            <p className="leading-relaxed text-muted">{t("bio1")}</p>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="leading-relaxed text-muted">{t("bio2")}</p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
