"use client";

import { useLocale, useTranslations } from "next-intl";
import { ScrollReveal } from "@/shared/ui";
import { HighlightsGrid } from "./highlights-grid";
import { TopicsTicker } from "./topics-ticker";
import { LearningRow } from "./learning-row";
import { AboutGraphSection } from "./graph-section";
import { GumText } from "./gum-text";

export function About() {
  const t = useTranslations("About");
  const locale = (useLocale() as string) ?? "en";
  const translate = t as (key: string) => string;

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

            <HighlightsGrid t={translate} />

            <TopicsTicker
              t={translate}
              currentlyLabel={t("highlights.currently")}
            />

            <LearningRow
              label={t("highlights.learning")}
              items={[
                t("highlights.learningItem1"),
                t("highlights.learningItem2"),
              ]}
            />
          </div>

          <AboutGraphSection />
        </div>
      </div>
    </section>
  );
}
