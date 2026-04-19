import * as THREE from "three";

export const BURST_COUNT = 28;
export const PARTICLE_COLORS = [0xffffff, 0xe0e8ff, 0xa5b4fc, 0x818cf8, 0xc7d2fe];
export const MIN_MS_BETWEEN_BURSTS = 80;

export type Burst = {
  positions: Float32Array;
  velocities: Float32Array;
  geometry: THREE.BufferGeometry;
  material: THREE.PointsMaterial;
  points: THREE.Points;
  age: number;
  duration: number;
};

export function makeDotTexture(): THREE.CanvasTexture {
  const size = 32;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size / 2,
  );
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(200,215,255,0.85)");
  g.addColorStop(1, "rgba(120,140,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(c);
}
