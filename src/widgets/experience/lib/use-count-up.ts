"use client";

import { useEffect, useState } from "react";
import { COUNT_UP_DURATION_MS } from "../config/metrics";

export function useCountUp(target: number, active: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let raf: number;
    const t0 = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - t0) / COUNT_UP_DURATION_MS, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target]);

  return count;
}
