"use client";

import { motion } from "motion/react";
import { certifications } from "./constants";

type CertificationsListProps = {
  label: string;
  getLabel: (key: (typeof certifications)[number]) => string;
};

export function CertificationsList({ label, getLabel }: CertificationsListProps) {
  return (
    <div className="mt-6">
      <p className="font-mono text-[10px] tracking-widest text-muted/50 uppercase mb-1">
        {label}
      </p>
      <div className="flex flex-col">
        {certifications.map((key, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.4,
              delay: i * 0.08,
              ease: [0.25, 0.4, 0.25, 1],
            }}
            className="group flex items-center gap-3 py-3 border-b border-border/50 cursor-default"
          >
            <span className="relative flex h-4 w-4 shrink-0 items-center justify-center">
              <span className="absolute inset-0 rounded-full border border-border transition-colors duration-200 group-hover:border-accent/50" />
              <span className="h-1.5 w-1.5 rounded-full bg-accent/40 transition-all duration-200 group-hover:bg-accent group-hover:scale-125" />
            </span>
            <span className="text-xs text-foreground/55 transition-colors duration-200 group-hover:text-foreground/90">
              {getLabel(key)}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
