"use client";

import { motion } from "motion/react";
import { NeuralGraph } from "./neural-graph";

export function AboutGraphSection() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, delay: 0.2 }}
      className="relative h-105 lg:h-full lg:min-h-135 rounded-4xl overflow-hidden"
    >
      <div className="absolute inset-y-0 left-0 w-16 bg-linear-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-16 bg-linear-to-b from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 bg-linear-to-l from-background to-transparent z-10 pointer-events-none" />
      <NeuralGraph />
    </motion.div>
  );
}
