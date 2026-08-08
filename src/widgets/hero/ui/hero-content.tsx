"use client";

import { motion } from "motion/react";
import { stagger, fadeUp } from "../config/motion";
import { FigmaSelect } from "./figma-select";
import { HeroIndexLabel } from "./hero-index-label";
import { HeroLeadText } from "./hero-lead-text";

type HeroContentProps = {
  name: string;
  role1: string;
  role2: string;
  whoDesc: string;
  pastDesc: string;
  nowText: string;
};

export function HeroContent({
  name,
  role1,
  role2,
  whoDesc,
  pastDesc,
  nowText,
}: HeroContentProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="pointer-events-auto flex flex-col gap-8 max-w-2xl"
    >
      <motion.h1
        variants={fadeUp}
        className="text-5xl font-bold leading-[1.02] tracking-tight text-foreground sm:text-6xl xl:text-[5.25rem]"
      >
        {name}
      </motion.h1>

      <motion.p variants={fadeUp} className="text-xl text-muted leading-snug">
        <FigmaSelect>{role1}</FigmaSelect>
        {role2}
      </motion.p>

      <motion.div variants={fadeUp} className="w-10 border-t border-border/60" />

      <motion.div
        variants={fadeUp}
        className="grid grid-cols-[3rem_1fr] gap-x-8 gap-y-8 items-start"
      >
        <HeroIndexLabel>Who</HeroIndexLabel>
        <p className="text-base leading-[1.8] max-w-115">
          <HeroLeadText text={whoDesc} />
        </p>

        <HeroIndexLabel>Past</HeroIndexLabel>
        <p className="text-base leading-[1.8] max-w-150">
          <HeroLeadText text={pastDesc} />
        </p>

        <HeroIndexLabel>Now</HeroIndexLabel>
        <p className="text-base leading-[1.8] lg:w-[calc(100%+10rem)]">
          <HeroLeadText text={nowText} />
        </p>
      </motion.div>
    </motion.div>
  );
}
