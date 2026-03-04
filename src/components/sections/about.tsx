"use client";

import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { HighlightsGrid } from "./about/highlights-grid";
import { TopicsTicker } from "./about/topics-ticker";
import { AboutGraphSection } from "./about/graph-section";
export function About() {
  const t = useTranslations("About");

  return (
    <section id="about" className="py-24 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-6 items-center min-h-135">
          <div className="flex flex-col gap-7">
            <ScrollReveal>
              <p className="font-mono text-xs tracking-widest text-accent uppercase">
                {t("label")}
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                {t("title")}
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <p className="text-base font-medium text-foreground/90 leading-relaxed">
                {t("description")}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <p className="text-sm leading-relaxed text-muted">{t("bio1")}</p>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="text-sm leading-relaxed text-muted">{t("bio2")}</p>
            </ScrollReveal>

            <HighlightsGrid t={t as (key: string) => string} />

            <TopicsTicker
              t={t as (key: string) => string}
              currentlyLabel={t("highlights.currently")}
            />
          </div>

          <AboutGraphSection />
        </div>
      </div>
    </section>
  );
}
