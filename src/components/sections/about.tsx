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
              <p className="font-mono text-[12px] tracking-widest text-muted/90 uppercase">
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
          </div>

          <AboutGraphSection />
        </div>
      </div>
    </section>
  );
}
