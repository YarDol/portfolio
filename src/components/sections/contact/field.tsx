"use client";

import { motion, AnimatePresence } from "motion/react";

export function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string | null;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block font-mono text-[10px] tracking-widest text-muted/50 uppercase select-none"
      >
        {label}
      </label>
      <div className="group rounded-xl border border-border/60 bg-foreground/3 transition-colors focus-within:border-accent/50 focus-within:bg-foreground/5">
        {children}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1.5 text-xs text-red-500"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
