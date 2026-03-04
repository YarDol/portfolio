"use client";

import { motion } from "motion/react";
import { OrbitalScene } from "./orbital";

type CareerCardProps = {
  role: string;
  company: string;
  period: string;
  location: string;
};

export function CareerCard({
  role,
  company,
  period,
  location,
}: CareerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.4, delay: 0.2 }}
      className="relative h-80 sm:h-96 lg:h-115 rounded-3xl overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-14 bg-linear-to-b from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 left-0 w-8 bg-linear-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-8 bg-linear-to-l from-background to-transparent z-10 pointer-events-none" />

      <OrbitalScene />

      <div className="absolute bottom-0 left-0 right-0 z-20 px-5 pb-4 pointer-events-none">
        <h3 className="text-base font-bold tracking-tight">{role}</h3>
        <p className="text-accent text-sm">{company}</p>
        <p className="font-mono text-[10px] text-muted/50 tracking-widest mt-0.5">
          {period} · {location}
        </p>
      </div>
    </motion.div>
  );
}
