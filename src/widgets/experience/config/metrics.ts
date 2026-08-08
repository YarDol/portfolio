/**
 * Counter targets for the impact grid. Labels come from the
 * `Experience.metrics.<index>` translations, so order is significant.
 */
export const METRICS = [
  { animateTo: 50, suffix: "+" },
  { animateTo: 40, suffix: "%" },
  { animateTo: 17, suffix: "%" },
  { animateTo: 700, suffix: "+" },
  { animateTo: 4, suffix: "" },
  { animateTo: 3, suffix: "" },
] as const;

export type Metric = (typeof METRICS)[number];

/** Milliseconds for a counter to reach its target. */
export const COUNT_UP_DURATION_MS = 1300;
