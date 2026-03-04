"use client";

import { motion } from "motion/react";
import { siteConfig } from "@/lib/constants";
import { VideoCircle } from "./video-circle";
import { stagger, fadeUp } from "./variants";

type HeroContentProps = {
  name: string;
  role: string;
  subtitle: string;
  note: string;
  workRights: string;
  cta: string;
  contact: string;
};

export function HeroContent({
  name,
  role,
  subtitle,
  note,
  workRights,
  cta,
  contact,
}: HeroContentProps) {
  return (
    <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-12">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="flex flex-col gap-7"
      >
        <motion.h1
          variants={fadeUp}
          className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl xl:text-7xl"
        >
          {name}
        </motion.h1>

        <motion.p variants={fadeUp} className="text-lg text-muted sm:text-xl">
          {role}
        </motion.p>

        <motion.p
          variants={fadeUp}
          className="max-w-sm text-base leading-relaxed text-muted/80"
        >
          {subtitle}
        </motion.p>

        <motion.p
          variants={fadeUp}
          className="max-w-sm text-xs text-muted/70 tracking-wide leading-relaxed"
        >
          {note}
        </motion.p>

        <motion.p
          variants={fadeUp}
          className="font-mono text-xs text-muted/60 tracking-wide"
        >
          {workRights}
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="flex flex-wrap items-center gap-6 pt-1"
        >
          <a
            href="#projects"
            className="text-sm font-medium text-foreground underline underline-offset-4 decoration-accent/60 hover:decoration-accent transition-colors"
          >
            {cta} →
          </a>
          <a
            href={siteConfig.cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-muted hover:text-foreground transition-colors underline underline-offset-4 decoration-muted/30 hover:decoration-muted"
          >
            Download CV
          </a>
          <a
            href="#contact"
            className="text-sm font-medium text-muted hover:text-foreground transition-colors underline underline-offset-4 decoration-muted/30 hover:decoration-muted"
          >
            {contact}
          </a>
        </motion.div>
      </motion.div>

      <div className="flex justify-center lg:justify-end">
        <VideoCircle />
      </div>
    </div>
  );
}
