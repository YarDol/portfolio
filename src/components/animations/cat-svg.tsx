"use client";

import { motion } from "motion/react";
import { CAT_D } from "./cat-path";

interface CatSVGProps {
  facing: "right" | "left";
  walking: boolean;
  jumping: boolean;
}

export function CatSVG({ facing, walking, jumping }: CatSVGProps) {
  return (
    <div
      style={{
        transform: facing === "right" ? "scaleX(-1)" : undefined,
        lineHeight: 0,
      }}
    >
      <motion.div
        style={{ transformOrigin: "50% 100%" }}
        animate={
          jumping
            ? { rotate: 0 }
            : walking
              ? { rotate: [-3, 3, -3] }
              : { rotate: [-1.5, 1.5, -1.5] }
        }
        transition={
          jumping
            ? { duration: 0.15 }
            : walking
              ? { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
              : { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <svg
          viewBox="0 0 800 800"
          width={44}
          height={44}
          style={{ display: "block" }}
          aria-hidden
        >
          <g
            transform="translate(0,800) scale(0.1,-0.1)"
            fill="currentColor"
            stroke="none"
          >
            <path d={CAT_D} />
          </g>
        </svg>
      </motion.div>
    </div>
  );
}
