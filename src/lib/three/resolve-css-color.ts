import * as THREE from "three";

export function resolveCssColor(cssVar: string): THREE.Color {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(cssVar)
    .trim();
  const tmp = document.createElement("div");
  tmp.style.color = raw.startsWith("oklch(") ? raw : `oklch(${raw})`;
  document.body.appendChild(tmp);
  const resolved = getComputedStyle(tmp).color;
  document.body.removeChild(tmp);
  const m = resolved.match(/\d+(\.\d+)?/g);
  if (!m || m.length < 3) return new THREE.Color(0xffffff);
  return new THREE.Color(
    parseInt(m[0]) / 255,
    parseInt(m[1]) / 255,
    parseInt(m[2]) / 255,
  );
}
