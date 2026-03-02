"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export function MouseGlow() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 150, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 30 });

  useEffect(() => {
    function onMove(e: MouseEvent) {
      mouseX.set(e.clientX - 160);
      mouseY.set(e.clientY - 160);
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      style={{ left: springX, top: springY }}
      className="pointer-events-none fixed h-80 w-80 rounded-full bg-accent/15 blur-3xl"
    />
  );
}
