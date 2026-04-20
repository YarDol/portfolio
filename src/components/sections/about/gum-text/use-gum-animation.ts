"use client";

import { useEffect } from "react";
import { CONNECTIONS } from "./constants";
import { makeRope, stepRope, buildSplinePath, spring } from "./rope";
import type { Rope } from "./types";

export function useGumAnimation(
  ropesRef: React.MutableRefObject<Map<string, Rope>>,
  pathRefs: React.MutableRefObject<Map<string, SVGPathElement>>,
  rafRef: React.MutableRefObject<number | null>,
  activeId: React.MutableRefObject<string | null>,
  center: (id: string) => { x: number; y: number } | null,
) {
  useEffect(() => {
    const ropes = ropesRef.current;
    const paths = pathRefs.current;

    for (const [a, b] of CONNECTIONS) {
      ropes.set(`${a}-${b}`, {
        pts: [],
        linkLen: 0,
        op: { v: 0, vel: 0 },
        active: false,
      });
    }

    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);
      const hov = activeId.current;

      for (const [a, b] of CONNECTIONS) {
        const key = `${a}-${b}`;
        let rope = ropes.get(key)!;
        const path = paths.get(key);
        const isActive = hov === a || hov === b;

        if (isActive && rope.pts.length === 0) {
          const ca = center(a);
          const cb = center(b);
          if (ca && cb) {
            const nr = makeRope(ca.x, ca.y, cb.x, cb.y);
            nr.op = rope.op;
            nr.active = true;
            ropes.set(key, nr);
            rope = nr;
          }
        }
        rope.active = isActive;
        rope.op = spring(
          rope.op,
          isActive ? 1 : 0,
          isActive ? 0.18 : 0.09,
          0.68,
        );
        const ov = rope.op.v;

        if (!path) continue;

        if (ov < 0.003 && !isActive) {
          path.style.opacity = "0";
          continue;
        }

        const ca = center(a);
        const cb = center(b);
        if (!ca || !cb || rope.pts.length === 0) continue;

        stepRope(rope, ca.x, ca.y, cb.x, cb.y);
        path.setAttribute("d", buildSplinePath(rope.pts));
        path.style.opacity = String(ov);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ropes.clear();
    };
  }, [ropesRef, pathRefs, rafRef, activeId, center]);
}
