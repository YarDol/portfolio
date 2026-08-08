"use client";

import { useLayoutEffect, useRef, useState } from "react";

export function FigmaSelect({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState("");

  useLayoutEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setSize(`${Math.round(rect.width)}×${Math.round(rect.height)}`);
    }
  }, []);

  return (
    <span ref={ref} className="figma-select">
      {children}
      <span className="figma-select-corners">
        <span className="figma-select-border" />
        <span className="figma-corner figma-corner--tl" />
        <span className="figma-corner figma-corner--tr" />
        <span className="figma-corner figma-corner--bl" />
        <span className="figma-corner figma-corner--br" />
        {size && <span className="figma-size-label">{size}</span>}
      </span>
    </span>
  );
}
