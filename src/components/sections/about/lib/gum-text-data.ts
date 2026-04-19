export type Seg =
  | { t: "plain"; text: string }
  | { t: "key"; id: string; text: string };

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

export function parse(text: string, kw: Record<string, string>): Seg[] {
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
