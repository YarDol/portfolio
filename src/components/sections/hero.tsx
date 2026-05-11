"use client";

import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { SkyScene } from "./hero/sky-scene";
import { MouseGlow } from "./hero/mouse-glow";
import { HeroContent } from "./hero/hero-content";
import { MoonAnnotations } from "./hero/moon-annotations";
import { SunAnnotations } from "./hero/sun-annotations";
import { ScrollIndicator } from "./hero/scroll-indicator";

export function Hero() {
  const t = useTranslations("Hero");
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative flex min-h-svh items-center overflow-hidden pt-20 pb-20 lg:pb-5"
    >
      <div className="absolute inset-0 z-0">
        <SkyScene />
      </div>

      <div className="pointer-events-none absolute inset-0 z-1 bg-linear-to-r from-background/95 via-background/70 to-background/25" />

      <MouseGlow />

      <MoonAnnotations />
      <SunAnnotations />

      <motion.div
        style={{ y, opacity }}
        className="pointer-events-none relative z-20 mx-auto w-full max-w-7xl px-6 lg:px-10"
      >
        <HeroContent
          name={t("name")}
          role1={t("role1")}
          role2={t("role2")}
          whoDesc={t("whoDesc")}
          pastDesc={t("pastDesc")}
          nowText={t("nowItem1Desc")}
        />
      </motion.div>

      <ScrollIndicator />
    </section>
  );
}
