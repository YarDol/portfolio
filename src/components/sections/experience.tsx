"use client";

import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { CareerCard } from "./experience/career-card";
import { CertificationsList } from "./experience/certifications-list";
import { MetricsGrid } from "./experience/metric-item";
import { EducationBlock } from "./experience/education";

export function Experience() {
  const t = useTranslations("Experience");
  const edu = useTranslations("Education");

  return (
    <section
      id="experience"
      className="border-t border-border py-24 overflow-hidden"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="lg:grid lg:grid-cols-[1fr_1fr] lg:gap-16 lg:items-start">
          <div className="lg:sticky lg:top-24 lg:self-start mb-12 lg:mb-0">
            <ScrollReveal className="mb-6">
              <p className="font-mono text-xs tracking-widest text-accent uppercase mb-2">
                {t("label")}
              </p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {t("title")}
              </h2>
            </ScrollReveal>

            <CareerCard
              role={t("kevych.role")}
              company={t("kevych.company")}
              period={t("kevych.period")}
              location={t("kevych.location")}
            />

            <CertificationsList
              label={edu("certifications")}
              getLabel={(key) => edu(key)}
            />
          </div>

          <div className="flex flex-col gap-14">
            <div>
              <ScrollReveal className="mb-2">
                <p className="font-mono text-[10px] tracking-widest text-muted/60 uppercase">
                  {t("impact")}
                </p>
              </ScrollReveal>
              <MetricsGrid />
            </div>

            <EducationBlock />
          </div>
        </div>
      </div>
    </section>
  );
}
