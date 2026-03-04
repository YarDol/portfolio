"use client";

import { useTranslations } from "next-intl";
import { motion, useInView } from "motion/react";
import { useRef, useEffect, useState } from "react";

const METRICS = [
  { animateTo: 50,  suffix: "+" },
  { animateTo: 40,  suffix: "%" },
  { animateTo: 17,  suffix: "%" },
  { animateTo: 700, suffix: "+" },
  { animateTo: 4,   suffix: ""  },
  { animateTo: 3,   suffix: ""  },
] as const;

function useCountUp(target: number, active: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf: number;
    const t0 = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - t0) / 1300, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target]);
  return count;
}

function MetricItem({
  animateTo, suffix, index, delay,
}: (typeof METRICS)[number] & { index: number; delay: number }) {
  const t      = useTranslations("Experience");
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const count  = useCountUp(animateTo, inView);
  const [hovered, setHovered] = useState(false);

  const label = t(`metrics.${index}.label` as Parameters<typeof t>[0]);
  const sub   = t(`metrics.${index}.sub`   as Parameters<typeof t>[0]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay, ease: [0.25, 0.4, 0.25, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative border-b border-border pt-4 pb-2 cursor-default"
    >
      <motion.div
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
        style={{ originX: 0 }}
        className="absolute bottom-0 left-0 right-0 h-px bg-accent"
      />
      <p className={`text-4xl font-black tabular-nums leading-none transition-colors duration-200 ${
        hovered ? "text-accent" : "text-foreground/75"
      }`}>
        {count}{suffix}
      </p>
      <p className="mt-2 text-xs font-semibold text-foreground/70 uppercase tracking-wider">{label}</p>
      <p className="mt-0.5 text-[11px] text-muted/60">{sub}</p>
    </motion.div>
  );
}

export function MetricsGrid() {
  return (
    <div className="grid grid-cols-2 gap-x-8">
      {METRICS.map((m, i) => (
        <MetricItem key={i} {...m} index={i} delay={i * 0.07} />
      ))}
    </div>
  );
}
