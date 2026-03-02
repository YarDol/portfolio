"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { NeuralGraph } from "./about/neural-graph";

const EXPLORE_TOPICS = [
  "topics.streaming",
  "topics.generation",
  "topics.interfaces",
  "topics.optimization",
] as const;

const highlights = [
  { key: "experience", labelKey: "experienceLabel" },
  { key: "apps", labelKey: "appsLabel" },
  { key: "users", labelKey: "usersLabel" },
  { key: "education", labelKey: "educationLabel" },
] as const;

export function About() {
  const t = useTranslations("About");
  const [topicIndex, setTopicIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setTopicIndex((i) => (i + 1) % EXPLORE_TOPICS.length),
      2800,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section id="about" className="py-24 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-6 items-center min-h-135">
          <div className="flex flex-col gap-7">
            <ScrollReveal>
              <p className="font-mono text-xs tracking-widest text-accent uppercase">
                {t("label")}
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                {t("title")}
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <p className="text-base font-medium text-foreground/90 leading-relaxed">
                {t("description")}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <p className="text-sm leading-relaxed text-muted">{t("bio1")}</p>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="text-sm leading-relaxed text-muted">{t("bio2")}</p>
            </ScrollReveal>

            <ScrollReveal delay={0.25}>
              <div className="grid grid-cols-4 gap-x-6 gap-y-3 pt-1 border-t border-border">
                {highlights.map(({ key, labelKey }) => (
                  <div key={key} className="pt-3">
                    <p className="text-lg font-bold text-accent">
                      {t(`highlights.${key}`)}
                    </p>
                    <p className="text-[11px] text-muted leading-tight mt-0.5">
                      {t(`highlights.${labelKey}`)}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] text-muted/40 tracking-wide whitespace-nowrap">
                  {t("highlights.currently")} →
                </span>
                <div className="relative h-4 overflow-hidden flex-1 max-w-55">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={topicIndex}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="absolute font-mono text-[11px] text-foreground/60 whitespace-nowrap"
                    >
                      {t(EXPLORE_TOPICS[topicIndex])}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="relative h-105 lg:h-full lg:min-h-135"
          >
            <div className="absolute inset-y-0 left-0 w-16 bg-linear-to-r from-background to-transparent z-10 pointer-events-none" />

            <div className="absolute inset-x-0 top-0 h-16 bg-linear-to-b from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-background to-transparent z-10 pointer-events-none" />

            <NeuralGraph />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
