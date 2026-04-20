export const CONNECTIONS: [string, string][] = [
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

export const KW_EN: Record<string, string> = {
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

export const KW_DE: Record<string, string> = {
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

export const SEGMENTS = 20;
export const SLACK = 1.035;
export const GRAVITY = 0.28;
export const FRICTION = 0.985;
export const ITERS = 14;
