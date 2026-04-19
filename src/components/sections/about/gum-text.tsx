"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { type Rope, spring, makeRope, stepRope, buildSplinePath } from "./lib/rope";
import { type Seg, CONNECTIONS, KW_EN, KW_DE, parse } from "./lib/gum-text-data";

export function GumText({
  paras,
  locale = "en",
}: {
  paras: string[];
  locale?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<Map<string, HTMLSpanElement>>(new Map());
  const pathRefs = useRef<Map<string, SVGPathElement>>(new Map());
  const ropesRef = useRef<Map<string, Rope>>(new Map());
  const activeId = useRef<string | null>(null);
  const rafRef = useRef<number | null>(null);

  const [activeSet, setActiveSet] = useState<ReadonlySet<string>>(new Set());

  const kw = locale === "de" ? KW_DE : KW_EN;
  const parsed = paras.map((p) => parse(p, kw));

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
        if (ov < 0.003 && !isActive) { path.style.opacity = "0"; continue; }

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

  const connected = new Set(CONNECTIONS.flat());

  return (
    <div ref={containerRef} className="relative">
      <svg
        className="pointer-events-none absolute inset-0 w-full h-full overflow-visible z-10"
        aria-hidden
      >
        {CONNECTIONS.map(([a, b]) => {
          const key = `${a}-${b}`;
          return (
            <path
              key={key}
              ref={(el) => {
                if (el) pathRefs.current.set(key, el);
                else pathRefs.current.delete(key);
              }}
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.35"
              strokeWidth="2"
              strokeLinecap="round"
              style={{ opacity: 0 }}
              className="text-foreground"
            />
          );
        })}
      </svg>

      <div className="flex flex-col gap-6 relative">
        {parsed.map((segs: Seg[], pi: number) => (
          <p key={pi} className="text-base leading-[1.85] text-foreground/80">
            {segs.map((seg: Seg, si: number) =>
              seg.t === "plain" ? (
                <span key={si}>{seg.text}</span>
              ) : (
                <span
                  key={si}
                  ref={(el) => register(seg.id, el)}
                  onMouseEnter={() => connected.has(seg.id) && handleEnter(seg.id)}
                  onMouseLeave={() => connected.has(seg.id) && handleLeave()}
                  className={[
                    "font-medium text-foreground/95",
                    connected.has(seg.id)
                      ? "cursor-default rounded-[3px] px-0.5 -mx-0.5 underline decoration-dotted underline-offset-3 decoration-foreground/30 hover:decoration-foreground/65 transition-colors duration-150"
                      : "",
                    activeSet.has(seg.id) ? "bg-foreground/10" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {seg.text}
                </span>
              ),
            )}
          </p>
        ))}
      </div>
    </div>
  );
}
