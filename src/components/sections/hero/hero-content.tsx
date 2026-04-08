"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { stagger, fadeUp } from "./variants";

type HeroContentProps = {
  name: string;
  role1: string;
  role2: string;
  whoDesc: string;
  pastDesc: string;
  nowText: string;
};

function FigmaSelect({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState("");

  useLayoutEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setSize(`${Math.round(rect.width)}×${Math.round(rect.height)}`);
    }
  }, []);

  return (
    <span ref={ref} className="figma-select">
      {children}
      <span className="figma-select-corners">
        <span className="figma-select-border" />
        <span className="figma-corner figma-corner--tl" />
        <span className="figma-corner figma-corner--tr" />
        <span className="figma-corner figma-corner--bl" />
        <span className="figma-corner figma-corner--br" />
        {size && <span className="figma-size-label">{size}</span>}
      </span>
    </span>
  );
}

function IndexLabel({ children }: { children: string }) {
  return (
    <span className="group relative inline-block text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/60 pt-0.5 cursor-default select-none w-fit">
      {children}

      <span className="absolute bottom-0 left-0 h-px w-full bg-foreground/20" />

      <span className="absolute bottom-0 left-0 h-px w-0 bg-foreground/65 transition-all duration-300 group-hover:w-full" />
    </span>
  );
}

function LeadText({ text }: { text: string }) {
  const cut = text.indexOf(". ");
  if (cut === -1) {
    return <span className="text-foreground/80">{text}</span>;
  }
  return (
    <>
      <span className="text-foreground/85">{text.slice(0, cut + 1)}</span>
      <span className="text-muted">{text.slice(cut + 1)}</span>
    </>
  );
}

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


      <motion.div
        variants={fadeUp}
        className="w-10 border-t border-border/60"
      />

  
      <motion.div
        variants={fadeUp}
        className="grid grid-cols-[3rem_1fr] gap-x-8 gap-y-8 items-start"
      >
        <IndexLabel>Who</IndexLabel>
        <p className="text-base leading-[1.8] max-w-115">
          <LeadText text={whoDesc} />
        </p>

        <IndexLabel>Past</IndexLabel>
        <p className="text-base leading-[1.8] max-w-150">
          <LeadText text={pastDesc} />
        </p>

        <IndexLabel>Now</IndexLabel>
        <p className="text-base leading-[1.8] lg:w-[calc(100%+10rem)]">
          <LeadText text={nowText} />
        </p>
      </motion.div>
    </motion.div>
  );
}
