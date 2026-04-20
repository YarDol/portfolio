"use client";

import { CONNECTIONS, KW_DE, KW_EN } from "./constants";
import { parse } from "./physics";
import { useGumRopes } from "./use-gum-ropes";

interface GumTextProps {
  paras: string[];
  locale?: string;
}

export function GumText({ paras, locale = "en" }: GumTextProps) {
  const kw = locale === "de" ? KW_DE : KW_EN;
  const parsed = paras.map((p) => parse(p, kw));
  const connected = new Set(CONNECTIONS.flat());

  const { containerRef, pathRefs, activeSet, register, handleEnter, handleLeave } =
    useGumRopes();

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
