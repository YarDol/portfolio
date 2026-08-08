"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useMoonLines } from "../lib/use-moon-lines";
import { ANNS, AnnotationId } from "../config/annotations";

export function MoonAnnotations() {
  const t = useTranslations("Hero.annotations");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  useMoonLines(canvasRef, textRefs);

  const getSubKey = (id: AnnotationId) => `${id}Sub` as Parameters<typeof t>[0];

  return (
    <div className="absolute inset-0 z-30 hidden lg:dark:block overflow-hidden">
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 w-full h-full"
      />

      {ANNS.map((ann, i) => (
        <div
          key={ann.id}
          ref={(el) => {
            textRefs.current[i] = el;
          }}
          className="absolute pointer-events-none"
          style={{ opacity: 0, transform: "translateY(calc(-100% - 8px))" }}
        >
          {ann.href ? (
            <a
              href={ann.href}
              target={ann.href.startsWith("#") ? undefined : "_blank"}
              rel={ann.href.startsWith("#") ? undefined : "noopener noreferrer"}
              className="pointer-events-auto block font-mono text-xs text-foreground/65 hover:text-foreground/90 transition-colors tracking-wide whitespace-nowrap cursor-pointer"
            >
              {t(ann.id)}
            </a>
          ) : (
            <p className="font-mono text-xs text-muted/75 tracking-wide whitespace-nowrap">
              {t(ann.id)}
            </p>
          )}
          {ann.sub && (
            <p className="font-mono text-[10px] text-muted/45 tracking-wide mt-0.5 whitespace-nowrap">
              {t(getSubKey(ann.id))}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
