"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
type FadeUpProps = {
  initial: { opacity: number; y: number };
  animate: { opacity: number; y: number };
  transition: { duration: number; delay: number; ease: [number, number, number, number] };
};

type ContactHeaderProps = {
  label: string;
  title: string;
  email: string;
  fadeUp: (delay: number) => FadeUpProps;
};

export function ContactHeader({
  label,
  title,
  email,
  fadeUp,
}: ContactHeaderProps) {
  return (
    <div className="mb-10">
      <motion.p
        {...fadeUp(0)}
        className="font-mono text-xs tracking-widest text-accent uppercase mb-3"
      >
        {label}
      </motion.p>
      <motion.h2
        {...fadeUp(0.06)}
        className="text-3xl font-bold tracking-tight sm:text-4xl mb-4"
      >
        {title}
      </motion.h2>
      <motion.a
        {...fadeUp(0.12)}
        href={`mailto:${email}`}
        className="group inline-flex items-center gap-2 text-muted hover:text-foreground transition-colors"
      >
        <span className="text-sm">{email}</span>
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </motion.a>
    </div>
  );
}
