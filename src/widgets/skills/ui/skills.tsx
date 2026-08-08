"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { skillCategories, type CategoryKey } from "@/entities/skill";
import { SkillsHeader } from "./skills-header";
import { SkillRow } from "./skill-row";

export function Skills() {
  const t = useTranslations("Skills");
  const [hovered, setHovered] = useState<CategoryKey | null>(null);

  return (
    <section className="border-t border-border py-24 relative overflow-hidden">
      {/* Graph paper grid */}
      <div className="graph-paper absolute inset-0 pointer-events-none" />
      {/* Vignette — fades the grid at the edges so it doesn't fight the content */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 85% 75% at 50% 50%, transparent 35%, var(--background) 100%)",
        }}
      />
      <div className="mx-auto max-w-6xl px-6 relative">
        <SkillsHeader label={t("label")} title={t("title")} />

        <div className="">
          {skillCategories.map((cat, i) => (
            <SkillRow
              key={cat.key}
              category={cat}
              index={i}
              isHovered={hovered === cat.key}
              isDimmed={hovered !== null && hovered !== cat.key}
              onHoverStart={() => setHovered(cat.key)}
              onHoverEnd={() => setHovered(null)}
              getCategoryLabel={(key) => t(key)}
              getItemLabel={(key) => t(key as Parameters<typeof t>[0])}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
