"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export function FloatingShapes() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -250]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -30]);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <motion.div
        style={{ y: y1, rotate: rotate1 }}
        className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-neutral-200 dark:border-neutral-800 opacity-40"
      />
      <motion.div
        style={{ y: y2, rotate: rotate2 }}
        className="absolute left-[5%] top-[40%] h-16 w-16 rotate-45 border border-accent/20 opacity-60"
      />
      <motion.div
        style={{ y: y3 }}
        className="absolute bottom-[14%] left-[20%] h-40 w-40 rounded-full bg-accent/5"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute left-[32%] top-[20%] grid grid-cols-3 gap-3 opacity-30"
      >
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
        ))}
      </motion.div>
      <motion.div
        style={{ y: y1 }}
        className="absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-accent/10 blur-3xl"
      />
    </div>
  );
}
