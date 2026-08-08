"use client";

import { ScrollReveal } from "@/shared/ui";

type LearningRowProps = {
  label: string;
  items: string[];
};

/** "Learning →  item · item" row under the highlights grid. */
export function LearningRow({ label, items }: LearningRowProps) {
  return (
    <ScrollReveal delay={0.35}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <span className="font-mono text-[11px] text-muted/60 tracking-wide whitespace-nowrap">
          {label} →
        </span>
        {items.map((item, i) => (
          <span key={item} className="contents">
            {i > 0 && (
              <span className="text-muted/40 text-[9px] max-sm:hidden">·</span>
            )}
            <span className="font-mono text-[11px] text-foreground/60">
              {item}
            </span>
          </span>
        ))}
      </div>
    </ScrollReveal>
  );
}
