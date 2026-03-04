"use client";

import { motion } from "motion/react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import type { skillCategories } from "@/lib/skills";

type Category = (typeof skillCategories)[number];

type SkillRowProps = {
  category: Category;
  index: number;
  isHovered: boolean;
  isDimmed: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  getCategoryLabel: (key: Category["key"]) => string;
  getItemLabel: (key: string) => string;
};

export function SkillRow({
  category,
  index,
  isHovered,
  isDimmed,
  onHoverStart,
  onHoverEnd,
  getCategoryLabel,
  getItemLabel,
}: SkillRowProps) {
  return (
    <ScrollReveal delay={index * 0.07}>
      <motion.div
        onHoverStart={onHoverStart}
        onHoverEnd={onHoverEnd}
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
          className={`font-mono text-[10px] tracking-widest uppercase shrink-0 sm:w-20 sm:pt-1 sm:ml-1 transition-colors duration-200 ${
            isHovered ? "text-accent" : "text-muted"
          }`}
        >
          {getCategoryLabel(category.key)}
        </span>

        <p
          style={{ overflowWrap: "anywhere" }}
          className={`text-sm leading-relaxed sm:pt-px min-w-0 flex-1 transition-colors duration-200 ${
            isHovered ? "text-foreground/90" : "text-foreground/60"
          }`}
        >
          {Array.from({ length: category.count }, (_, j) => (
            <span key={j}>
              {getItemLabel(`items.${category.key}.${j}`)}
              {j < category.count - 1 && (
                <span className="mx-2 select-none text-foreground/20">·</span>
              )}
            </span>
          ))}
        </p>
      </motion.div>
    </ScrollReveal>
  );
}
