"use client";

import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { highlights } from "./constants";

type HighlightsGridProps = {
  t: (key: string) => string;
};

export function HighlightsGrid({ t }: HighlightsGridProps) {
  return (
    <ScrollReveal delay={0.25}>
      <div className="grid grid-cols-4 gap-x-6 gap-y-3 pt-1 border-t border-border">
        {highlights.map(({ key, labelKey }) => (
          <div key={key} className="pt-3">
            <p className="text-lg font-bold text-accent">
              {t(`highlights.${key}`)}
            </p>
            <p className="text-[11px] text-muted leading-tight mt-0.5">
              {t(`highlights.${labelKey}`)}
            </p>
          </div>
        ))}
      </div>
    </ScrollReveal>
  );
}
