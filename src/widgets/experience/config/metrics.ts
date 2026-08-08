export const METRICS = [
  { animateTo: 50, suffix: "+" },
  { animateTo: 40, suffix: "%" },
  { animateTo: 17, suffix: "%" },
  { animateTo: 700, suffix: "+" },
  { animateTo: 5, suffix: "" },
  { animateTo: 5, suffix: "" },
] as const;

export type Metric = (typeof METRICS)[number];

export const COUNT_UP_DURATION_MS = 1300;
