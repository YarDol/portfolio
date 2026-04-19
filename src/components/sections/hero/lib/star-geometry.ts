import * as THREE from "three";

export const STAR_COUNT = 2600;
export const BRIGHT_STAR_COUNT = 22;

export function seededRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

export function createStarGeometry(
  count: number,
  seed: number,
  minRadius: number,
  maxRadius: number,
): THREE.BufferGeometry {
  const rand = seededRng(seed);
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = minRadius + rand() * (maxRadius - minRadius);
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  return geo;
}
