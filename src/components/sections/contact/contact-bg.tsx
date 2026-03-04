"use client";

import { useEffect, useRef } from "react";

interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export function ContactBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const DOT_COUNT = 55;
    const CONNECTION_DIST = 120;
    let dots: Dot[] = [];
    let w = 0;
    let h = 0;
    let rafId: number;

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * devicePixelRatio;
      canvas.height = h * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };

    const init = () => {
      dots = Array.from({ length: DOT_COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
      }));
    };

    const getAccentRgb = () => {
      const raw = getComputedStyle(document.documentElement)
        .getPropertyValue("--accent")
        .trim();
      const tmp = document.createElement("div");
      tmp.style.color = raw.startsWith("oklch(") ? raw : `oklch(${raw})`;
      document.body.appendChild(tmp);
      const resolved = getComputedStyle(tmp).color;
      document.body.removeChild(tmp);
      const m = resolved.match(/\d+(\.\d+)?/g);
      if (!m || m.length < 3) return "255,255,255";
      return `${m[0]},${m[1]},${m[2]}`;
    };

    let accentRgb = "255,255,255";
    const updateAccent = () => { accentRgb = getAccentRgb(); };
    updateAccent();

    const mo = new MutationObserver(updateAccent);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      ctx.clearRect(0, 0, w, h);

      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > w) d.vx *= -1;
        if (d.y < 0 || d.y > h) d.vy *= -1;
      }

      // Connections
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.08;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${accentRgb},${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.stroke();
          }
        }
      }

      // Dots
      for (const d of dots) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(${accentRgb},0.15)`;
        ctx.arc(d.x, d.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const ro = new ResizeObserver(() => {
      resize();
      init();
    });
    ro.observe(canvas);
    resize();
    init();
    tick();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      mo.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 1 }}
    />
  );
}
