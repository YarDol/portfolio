"use client";

import { motion } from "motion/react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { SkillsGlobe } from "./globe";

type SkillsHeaderProps = {
  label: string;
  title: string;
};

export function SkillsHeader({ label, title }: SkillsHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-8 mb-10 sm:mb-0">
      <ScrollReveal>
        <p className="font-mono text-xs tracking-widest text-accent uppercase mb-2">
          {label}
        </p>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
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
  );
}
