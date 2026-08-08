"use client";

import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/shared/ui";
import { educationEntries } from "../config/education";

export function EducationBlock() {
  const edu = useTranslations("Education");

  return (
    <ScrollReveal>
      <p className="font-mono text-xs tracking-widest text-accent uppercase mb-6">
        {edu("label")}
      </p>

      <div className="flex flex-col gap-5">
        {educationEntries.map((key) => (
          <div key={key} className="border-l border-border pl-4">
            <p className="text-sm font-medium text-foreground/85">
              {edu(`${key}.degree`)}
            </p>
            <p className="text-xs text-muted mt-0.5">{edu(`${key}.school`)}</p>
            <p className="font-mono text-[11px] text-accent/60 mt-1">
              {edu(`${key}.period`)}
            </p>
          </div>
        ))}
      </div>
    </ScrollReveal>
  );
}
