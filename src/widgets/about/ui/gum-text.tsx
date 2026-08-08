"use client";

import { useRef, useEffect, useCallback, useState } from "react";

const CONNECTIONS: [string, string][] = [
  ["users", "growth"],
  ["users", "performance"],
  ["performance", "latency"],
  ["performance", "scale"],
  ["decisions", "scale"],
  ["decisions", "ship"],
  ["software", "team"],
  ["team", "wins"],
  ["ship", "wins"],
  ["ship", "team"],
];

const KW_EN: Record<string, string> = {
  users: "100k+ users",
  growth: "engineering growth",
  performance: "high-performance",
  latency: "sub-second latency",
  decisions: "bold architectural decisions",
  scale: "real-world scale",
  software: "great software",
  team: "team sport",
  ship: "ship quickly",
  wins: "wins together",
};

const KW_DE: Record<string, string> = {
  users: "100.000 Nutzer",
  growth: "Engineering-Wachstum",
  performance: "hochperformanten",
  latency: "Sub-Sekunden-Latenz",
  decisions: "Architekturentscheidungen",
  scale: "echten Bedingungen",
  software: "gute Software",
  team: "Teamsport",
  ship: "schnell liefern",
  wins: "Erfolge gemeinsam",
};

const SEGMENTS = 20;
const SLACK = 1.035;
const GRAVITY = 0.28;
const FRICTION = 0.985;
const ITERS = 14;

type Seg =
  | { t: "plain"; text: string }
  | { t: "key"; id: string; text: string };
interface Sp {
  v: number;
  vel: number;
}
interface Pt {
  x: number;
  y: number;
  px: number;
  py: number;
}
interface Rope {
  pts: Pt[];
  linkLen: number;
  op: Sp;
  active: boolean;
}

function spring(s: Sp, target: number, k = 0.15, d = 0.65): Sp {
  const f = (target - s.v) * k;
  const vel = s.vel * d + f;
  return { v: s.v + vel, vel };
}

function parse(text: string, kw: Record<string, string>): Seg[] {
  const hits = Object.entries(kw)
    .map(([id, word]) => ({ id, word, start: text.indexOf(word) }))
    .filter((h) => h.start !== -1)
    .sort((a, b) => a.start - b.start);
  const segs: Seg[] = [];
  let cur = 0;
  for (const { id, word, start } of hits) {
    if (start < cur) continue;
    if (cur < start) segs.push({ t: "plain", text: text.slice(cur, start) });
    segs.push({ t: "key", id, text: word });
    cur = start + word.length;
  }
  if (cur < text.length) segs.push({ t: "plain", text: text.slice(cur) });
  return segs;
}

function makeRope(x1: number, y1: number, x2: number, y2: number): Rope {
  const dist = Math.hypot(x2 - x1, y2 - y1);
  const linkLen = (dist * SLACK) / (SEGMENTS - 1);
  const pts: Pt[] = Array.from({ length: SEGMENTS }, (_, i) => {
    const t = i / (SEGMENTS - 1);
    const x = x1 + (x2 - x1) * t;
    const y = y1 + (y2 - y1) * t;
    return { x, y, px: x, py: y };
  });
  return { pts, linkLen, op: { v: 0, vel: 0 }, active: false };
}

function stepRope(rope: Rope, x1: number, y1: number, x2: number, y2: number) {
  const { pts, linkLen } = rope;
  const N = pts.length;

  for (let i = 1; i < N - 1; i++) {
    const p = pts[i];
    const vx = (p.x - p.px) * FRICTION;
    const vy = (p.y - p.py) * FRICTION;
    p.px = p.x;
    p.py = p.y;
    p.x += vx;
    p.y += vy + GRAVITY;
  }

  for (let it = 0; it < ITERS; it++) {
    pts[0].x = x1;
    pts[0].y = y1;
    pts[N - 1].x = x2;
    pts[N - 1].y = y2;
    for (let i = 0; i < N - 1; i++) {
      const a = pts[i],
        b = pts[i + 1];
      const dx = b.x - a.x,
        dy = b.y - a.y;
      const d = Math.sqrt(dx * dx + dy * dy) || 0.001;
      const corr = ((d - linkLen) / d) * 0.5;
      if (i > 0) {
        a.x += dx * corr;
        a.y += dy * corr;
      }
      if (i < N - 2) {
        b.x -= dx * corr;
        b.y -= dy * corr;
      }
    }
  }
  pts[0].x = x1;
  pts[0].y = y1;
  pts[N - 1].x = x2;
  pts[N - 1].y = y2;
}

function buildSplinePath(pts: Pt[]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

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
          const ca = center(a),
            cb = center(b);
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

        const ca = center(a),
          cb = center(b);
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
        {parsed.map((segs, pi) => (
          <p key={pi} className="text-base leading-[1.85] text-foreground/80">
            {segs.map((seg, si) =>
              seg.t === "plain" ? (
                <span key={si}>{seg.text}</span>
              ) : (
                <span
                  key={si}
                  ref={(el) => register(seg.id, el)}
                  onMouseEnter={() =>
                    connected.has(seg.id) && handleEnter(seg.id)
                  }
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
