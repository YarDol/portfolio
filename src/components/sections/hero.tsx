"use client";

import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowDown } from "lucide-react";
import { siteConfig } from "@/lib/constants";
import { FloatingShapes } from "./hero/floating-shapes";
import { MouseGlow } from "./hero/mouse-glow";
import { VideoCircle } from "./hero/video-circle";
import { stagger, fadeUp } from "./hero/variants";

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
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      <MouseGlow />
      <FloatingShapes />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-12"
      >
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
              {t("name")}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg text-muted sm:text-xl"
            >
              {t("role")}
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="max-w-sm text-sm leading-relaxed text-muted/70"
            >
              {t("subtitle")}
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="font-mono text-xs text-muted/40 tracking-wide"
            >
              {t("workRights")}
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-wrap items-center gap-6 pt-1"
            >
              <a
                href="#projects"
                className="text-sm font-medium text-foreground underline underline-offset-4 decoration-accent/60 hover:decoration-accent transition-colors"
              >
                {t("cta")} →
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
                {t("contact")}
              </a>
            </motion.div>
          </motion.div>

          <div className="flex justify-center lg:justify-end">
            <VideoCircle />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
        >
          <ArrowDown className="h-4 w-4 text-muted/30" />
        </motion.div>
      </motion.div>
    </section>
  );
}
