import { SEGMENTS, SLACK, GRAVITY, FRICTION, ITERS } from "./constants";
import type { Pt, Rope, Sp } from "./types";

export function spring(s: Sp, target: number, k = 0.15, d = 0.65): Sp {
  const f = (target - s.v) * k;
  const vel = s.vel * d + f;
  return { v: s.v + vel, vel };
}

export function makeRope(x1: number, y1: number, x2: number, y2: number): Rope {
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

export function stepRope(
  rope: Rope,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) {
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
      const a = pts[i];
      const b = pts[i + 1];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.sqrt(dx * dx + dy * dy) || 0.001;
      const corr = ((d - linkLen) / d) * 0.5;
      if (i > 0) { a.x += dx * corr; a.y += dy * corr; }
      if (i < N - 2) { b.x -= dx * corr; b.y -= dy * corr; }
    }
  }
  pts[0].x = x1; pts[0].y = y1;
  pts[N - 1].x = x2; pts[N - 1].y = y2;
}

export function buildSplinePath(pts: Pt[]): string {
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
