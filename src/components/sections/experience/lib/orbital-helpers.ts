import * as THREE from "three";

export const ORBITS = [
  { radius: 1.55, speed: 0.55, incline: 0.3, phase: 0 },
  { radius: 2.1, speed: 0.38, incline: -0.55, phase: Math.PI / 3 },
  { radius: 2.6, speed: 0.28, incline: 0.65, phase: (2 * Math.PI) / 3 },
  { radius: 1.9, speed: 0.46, incline: -0.2, phase: Math.PI },
  { radius: 3.0, speed: 0.22, incline: 0.45, phase: (4 * Math.PI) / 3 },
  { radius: 2.35, speed: 0.34, incline: -0.7, phase: (5 * Math.PI) / 3 },
] as const;

export const ORBIT_SEGMENTS = 128;

export function makeOrbitRing(radius: number, incline: number): THREE.BufferGeometry {
  const pts: number[] = [];
  for (let i = 0; i <= ORBIT_SEGMENTS; i++) {
    const θ = (i / ORBIT_SEGMENTS) * Math.PI * 2;
    pts.push(
      Math.cos(θ) * radius,
      Math.sin(θ) * radius * Math.sin(incline),
      Math.sin(θ) * radius * Math.cos(incline),
    );
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  return geo;
}

export function getOrbitPos(
  o: (typeof ORBITS)[number],
  t: number,
): THREE.Vector3 {
  const θ = t * o.speed + o.phase;
  return new THREE.Vector3(
    Math.cos(θ) * o.radius,
    Math.sin(θ) * o.radius * Math.sin(o.incline),
    Math.sin(θ) * o.radius * Math.cos(o.incline),
  );
}
