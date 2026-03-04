"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { EXPLORE_TOPICS } from "./constants";

type TopicsTickerProps = {
  t: (key: (typeof EXPLORE_TOPICS)[number] | string) => string;
  currentlyLabel: string;
};

export function TopicsTicker({ t, currentlyLabel }: TopicsTickerProps) {
  const [topicIndex, setTopicIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setTopicIndex((i) => (i + 1) % EXPLORE_TOPICS.length),
      2800,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <ScrollReveal delay={0.3}>
      <div className="flex items-center gap-3">
        <span className="font-mono text-[11px] text-muted/60 tracking-wide whitespace-nowrap">
          {currentlyLabel} →
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
  );
}
