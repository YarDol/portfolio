"use client";

import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/ui/section-heading";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Briefcase, GraduationCap, Award } from "lucide-react";

const experienceKeys = [
  "kevych.items.0",
  "kevych.items.1",
  "kevych.items.2",
  "kevych.items.3",
  "kevych.items.4",
  "kevych.items.5",
] as const;

const educationEntries = ["master", "bachelor", "exchange", "junior"] as const;

const certifications = ["aws", "front-end", "java-script"] as const;

export function Experience() {
  const t = useTranslations("Experience");
  const edu = useTranslations("Education");

  return (
    <section id="experience" className="border-t border-border py-24">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading label={t("label")} title={t("title")} />

        <div className="relative">
          <div className="absolute left-0 top-0 hidden h-full w-px bg-border md:left-8 md:block" />

          <ScrollReveal>
            <div className="relative md:pl-20">
              <div className="absolute left-0 top-0 hidden h-16 w-16 items-center justify-center rounded-full border border-border bg-card md:flex">
                <Briefcase className="h-6 w-6 text-accent" />
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold">{t("kevych.role")}</h3>
                    <p className="text-accent">{t("kevych.company")}</p>
                    <p className="text-sm text-muted">{t("kevych.location")}</p>
                  </div>
                  <span className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
                    {t("kevych.period")}
                  </span>
                </div>

                <ul className="mt-4 space-y-3">
                  {experienceKeys.map((key, i) => (
                    <ScrollReveal key={key} delay={i * 0.05}>
                      <li className="flex gap-3 text-sm leading-relaxed text-muted">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        {t(key)}
                      </li>
                    </ScrollReveal>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal className="mt-8">
            <div className="relative md:pl-20">
              <div className="absolute left-0 top-0 hidden h-16 w-16 items-center justify-center rounded-full border border-border bg-card md:flex">
                <GraduationCap className="h-6 w-6 text-accent" />
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="mb-4 font-mono text-sm font-medium tracking-wide text-accent uppercase">
                  {edu("title")}
                </h3>

                <div className="space-y-4">
                  {educationEntries.map((key) => (
                    <div key={key}>
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="font-medium">{edu(`${key}.degree`)}</p>
                          <p className="text-sm text-muted">
                            {edu(`${key}.school`)}
                          </p>
                        </div>
                        <span className="text-sm text-muted">
                          {edu(`${key}.period`)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-accent/80">
                        {edu(`${key}.note`)}
                      </p>
                    </div>
                  ))}

                  <div className="border-t border-border pt-4">
                    <div className="mb-3 flex items-center gap-2">
                      <Award className="h-4 w-4 text-accent" />
                      <p className="font-mono text-xs font-medium tracking-wide text-accent uppercase">
                        Certifications
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {certifications.map((key) => (
                        <span
                          key={key}
                          className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground"
                        >
                          {edu(key)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
