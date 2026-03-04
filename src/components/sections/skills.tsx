"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { skillCategories, type CategoryKey } from "@/lib/skills";
import { SkillsHeader } from "./skills/skills-header";
import { SkillRow } from "./skills/skill-row";

export function Skills() {
  const t = useTranslations("Skills");
  const [hovered, setHovered] = useState<CategoryKey | null>(null);

  return (
    <section className="border-t border-border py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SkillsHeader label={t("label")} title={t("title")} />

        <div className="border-t border-border">
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
