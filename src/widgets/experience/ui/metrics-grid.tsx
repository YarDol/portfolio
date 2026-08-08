"use client";

import { METRICS } from "../config/metrics";
import { MetricItem } from "./metric-item";

export function MetricsGrid() {
  return (
    <div className="grid grid-cols-2 gap-x-8">
      {METRICS.map((m, i) => (
        <MetricItem key={i} {...m} index={i} delay={i * 0.07} />
      ))}
    </div>
  );
}
