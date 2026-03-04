"use client";

import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { FloatingShapes } from "./hero/floating-shapes";
import { MouseGlow } from "./hero/mouse-glow";
import { HeroContent } from "./hero/hero-content";
import { ScrollIndicator } from "./hero/scroll-indicator";

export function Hero() {
  const t = useTranslations("Hero");
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const opacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative flex min-h-svh items-center overflow-hidden pt-20"
    >
      <MouseGlow />
      <FloatingShapes />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 mx-auto w-full max-w-6xl px-6 lg:px-6"
      >
        <HeroContent
          name={t("name")}
          role={t("role")}
          subtitle={t("subtitle")}
          note={t("note")}
          workRights={t("workRights")}
          cta={t("cta")}
          contact={t("contact")}
        />
      </motion.div>

      <ScrollIndicator />
    </section>
  );
}
