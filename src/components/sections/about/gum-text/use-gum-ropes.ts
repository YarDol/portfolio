"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CONNECTIONS } from "./constants";
import { buildSplinePath, makeRope, spring, stepRope } from "./physics";
import type { Rope } from "./types";

export function useGumRopes() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<Map<string, HTMLSpanElement>>(new Map());
  const pathRefs = useRef<Map<string, SVGPathElement>>(new Map());
  const ropesRef = useRef<Map<string, Rope>>(new Map());
  const activeId = useRef<string | null>(null);
  const rafRef = useRef<number | null>(null);

  const [activeSet, setActiveSet] = useState<ReadonlySet<string>>(new Set());

  const register = useCallback((id: string, el: HTMLSpanElement | null) => {
    if (el) wordRefs.current.set(id, el);
    else wordRefs.current.delete(id);
  }, []);

  const center = useCallback((id: string) => {
    const el = wordRefs.current.get(id);
    const box = containerRef.current;
    if (!el || !box) return null;
    const rects = el.getClientRects();
    const er = rects[0] ?? el.getBoundingClientRect();
    const cr = box.getBoundingClientRect();
    return {
      x: er.left - cr.left + er.width / 2,
      y: er.top - cr.top + er.height * 0.75,
    };
  }, []);

  const handleEnter = useCallback((id: string) => {
    activeId.current = id;
    const linked = new Set<string>([id]);
    for (const [a, b] of CONNECTIONS) {
      if (a === id) linked.add(b);
      if (b === id) linked.add(a);
    }
    setActiveSet(linked);
  }, []);

  const handleLeave = useCallback(() => {
    activeId.current = null;
    setActiveSet(new Set());
  }, []);

  useEffect(() => {
    const ropes = ropesRef.current;
    const paths = pathRefs.current;

    for (const [a, b] of CONNECTIONS) {
      ropes.set(`${a}-${b}`, { pts: [], linkLen: 0, op: { v: 0, vel: 0 }, active: false });
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
          const ca = center(a), cb = center(b);
          if (ca && cb) {
            const nr = makeRope(ca.x, ca.y, cb.x, cb.y);
            nr.op = rope.op;
            nr.active = true;
            ropes.set(key, nr);
            rope = nr;
          }
        }

        rope.active = isActive;
        rope.op = spring(rope.op, isActive ? 1 : 0, isActive ? 0.18 : 0.09, 0.68);
        const ov = rope.op.v;

        if (!path) continue;

        if (ov < 0.003 && !isActive) {
          path.style.opacity = "0";
          continue;
        }

        const ca = center(a), cb = center(b);
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
  }, [center]);

  return { containerRef, pathRefs, activeSet, register, handleEnter, handleLeave };
}
