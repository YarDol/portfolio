import type * as THREE from "three";

export type Burst = {
  positions: Float32Array;
  velocities: Float32Array;
  geometry: THREE.BufferGeometry;
  material: THREE.PointsMaterial;
  points: THREE.Points;
  age: number;
  duration: number;
};
