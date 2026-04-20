import type { Seg } from "./types";

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
