"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { useState } from "react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { skillCategories } from "@/lib/skills";
import { SkillsGlobe } from "./skills/globe";

type CategoryKey = (typeof skillCategories)[number]["key"];

export function Skills() {
  const t = useTranslations("Skills");
  const [hovered, setHovered] = useState<CategoryKey | null>(null);

  return (
    <section className="border-t border-border py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-start justify-between gap-8 mb-10 sm:mb-0">
          <ScrollReveal>
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
            transition={{ duration: 1.6, delay: 0.4 }}
            className="hidden sm:block shrink-0 w-32 h-32 lg:w-40 lg:h-40"
          >
            <SkillsGlobe />
          </motion.div>
        </div>

        <div className="border-t border-border">
          {skillCategories.map((cat, i) => {
            const isHovered = hovered === cat.key;
            const isDimmed = hovered !== null && !isHovered;

            return (
              <ScrollReveal key={cat.key} delay={i * 0.07}>
                <motion.div
                  onHoverStart={() => setHovered(cat.key)}
                  onHoverEnd={() => setHovered(null)}
                  animate={{ opacity: isDimmed ? 0.28 : 1 }}
                  transition={{ duration: 0.18 }}
                  className="relative flex flex-col gap-1 py-4 border-b border-border cursor-default sm:flex-row sm:items-start sm:gap-6"
                >
                  <motion.div
                    animate={{
                      scaleY: isHovered ? 1 : 0,
                      opacity: isHovered ? 1 : 0,
                    }}
                    transition={{ duration: 0.18, ease: [0.25, 0.4, 0.25, 1] }}
                    style={{ originY: 0 }}
                    className="absolute left-0 top-2 bottom-2 w-px bg-accent"
                  />

                  <span
                    className={`font-mono text-[10px] tracking-widest uppercase shrink-0 sm:w-20 sm:pt-1 sm:ml-1 transition-colors  duration-200 ${
                      isHovered ? "text-accent" : "text-muted"
                    }`}
                  >
                    {t(cat.key)}
                  </span>

                  <p
                    style={{ overflowWrap: "anywhere" }}
                    className={`text-sm leading-relaxed sm:pt-px min-w-0 flex-1 transition-colors duration-200 ${
                      isHovered ? "text-foreground/90" : "text-foreground/60"
                    }`}
                  >
                    {cat.skills.map((skill, j) => (
                      <span key={skill}>
                        {skill}
                        {j < cat.skills.length - 1 && (
                          <span className="mx-2  select-none bold text-foreground/20">
                            ·
                          </span>
                        )}
                      </span>
                    ))}
                  </p>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
