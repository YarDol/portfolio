import * as THREE from "three";
import { ORBITS, ORBIT_SEGMENTS } from "./constants";

export function makeOrbitRing(
  radius: number,
  incline: number,
): THREE.BufferGeometry {
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
