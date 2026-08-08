"use client";

import { useMotionValue, useSpring, useTransform } from "motion/react";

/**
 * Pointer-driven 3D tilt. Spread the returned handlers on the element that
 * should react, and the rotate values on the element that should transform.
 */
export function useTilt(strength = 5) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(my, [0, 1], [strength, -strength]), {
    stiffness: 280,
    damping: 28,
  });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-strength, strength]), {
    stiffness: 280,
    damping: 28,
  });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };

  const onMouseLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return { rotateX, rotateY, onMouseMove, onMouseLeave };
}
