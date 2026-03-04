"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { OrbitalScene } from "./experience/orbital";
import { MetricsGrid } from "./experience/metric-item";
import { EducationBlock } from "./experience/education";

export function Experience() {
  const t = useTranslations("Experience");
  const edu = useTranslations("Education");
  const certifications = ["aws", "front-end", "java-script"] as const;

  return (
    <section
      id="experience"
      className="border-t border-border py-24 overflow-hidden"
    >
      <div className="mx-auto max-w-5xl px-6">
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

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, delay: 0.2 }}
              className="relative h-80 sm:h-96 lg:h-115 rounded-3xl overflow-hidden"
            >
              <div className="absolute inset-x-0 top-0 h-14 bg-linear-to-b from-background to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-background to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-y-0 left-0  w-8  bg-linear-to-r from-background to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-8  bg-linear-to-l from-background to-transparent z-10 pointer-events-none" />

              <OrbitalScene />

              <div className="absolute bottom-0 left-0 right-0 z-20 px-5 pb-4 pointer-events-none">
                <h3 className="text-base font-bold tracking-tight">
                  {t("kevych.role")}
                </h3>
                <p className="text-accent text-sm">{t("kevych.company")}</p>
                <p className="font-mono text-[10px] text-muted/50 tracking-widest mt-0.5">
                  {t("kevych.period")} · {t("kevych.location")}
                </p>
              </div>
            </motion.div>

            <div className="mt-8 pt-4">
              <p className="font-mono text-[10px] tracking-widest text-muted/50 uppercase mb-1">
                Certifications
              </p>
              <div className="flex flex-col">
                {certifications.map((key, i) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: i * 0.08,
                      ease: [0.25, 0.4, 0.25, 1],
                    }}
                    className="group flex items-center gap-3 py-3 border-b border-border/50 cursor-default"
                  >
                    <span className="relative flex h-4 w-4 shrink-0 items-center justify-center">
                      <span className="absolute inset-0 rounded-full border border-border transition-colors duration-200 group-hover:border-accent/50" />
                      <span className="h-1.5 w-1.5 rounded-full bg-accent/40 transition-all duration-200 group-hover:bg-accent group-hover:scale-125" />
                    </span>
                    <span className="text-xs text-foreground/55 transition-colors duration-200 group-hover:text-foreground/90">
                      {edu(key)}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
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
