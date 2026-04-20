export const ORBITS = [
  { radius: 1.55, speed: 0.55, incline: 0.3,   phase: 0 },
  { radius: 2.1,  speed: 0.38, incline: -0.55,  phase: Math.PI / 3 },
  { radius: 2.6,  speed: 0.28, incline: 0.65,   phase: (2 * Math.PI) / 3 },
  { radius: 1.9,  speed: 0.46, incline: -0.2,   phase: Math.PI },
  { radius: 3.0,  speed: 0.22, incline: 0.45,   phase: (4 * Math.PI) / 3 },
  { radius: 2.35, speed: 0.34, incline: -0.7,   phase: (5 * Math.PI) / 3 },
] as const;

export const ORBIT_SEGMENTS = 128;
