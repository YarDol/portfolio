"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { HighlightsGrid } from "./about/highlights-grid";
import { TopicsTicker } from "./about/topics-ticker";
import { AboutGraphSection } from "./about/graph-section";
import { GumText } from "./about/gum-text";

export function About() {
  const t = useTranslations("About");
  const locale = (useLocale() as string) ?? "en";

  return (
    <section id="about" className="py-24 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-6 items-center min-h-135">
          <div className="flex flex-col gap-8">
            <ScrollReveal>
              <p className="font-mono text-[12px] tracking-widest text-accent uppercase">
                {t("label")}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.08}>
              <GumText
                paras={[t("description"), t("bio1"), t("bio2")]}
                locale={locale}
              />
            </ScrollReveal>

            <HighlightsGrid t={t as (key: string) => string} />

            <TopicsTicker
              t={t as (key: string) => string}
              currentlyLabel={t("highlights.currently")}
            />

            <ScrollReveal delay={0.35}>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <span className="font-mono text-[11px] text-muted/60 tracking-wide whitespace-nowrap">
                  {t("highlights.learning")} →
                </span>
                <span className="font-mono text-[11px] text-foreground/60">
                  {t("highlights.learningItem1")}
                </span>
                <span className="text-muted/40 text-[9px] max-sm:hidden">·</span>
                <span className="font-mono text-[11px] text-foreground/60">
                  {t("highlights.learningItem2")}
                </span>
              </div>
            </ScrollReveal>
          </div>

          <AboutGraphSection />
        </div>
      </div>
    </section>
  );
}
