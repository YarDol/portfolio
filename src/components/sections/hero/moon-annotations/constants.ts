import { siteConfig } from "@/lib/constants";

export function getMoonScreen(
  W: number,
  H: number,
): { x: number; y: number; r: number } {
  if (!W || !H) return { x: 0.66, y: 0.36, r: 0.2 };
  const aspect = W / H;
  const halfFovY = (65 * Math.PI) / 360;
  const tanHalfFovY = Math.tan(halfFovY);
  const dz = 8.5;
  const ndcX = 3.1 / (dz * tanHalfFovY * aspect);
  const ndcY = 1.5 / (dz * tanHalfFovY);

  const rFrac = 2.2 / (dz * tanHalfFovY) / 2;
  return {
    x: (ndcX + 1) / 2,
    y: (1 - ndcY) / 2,
    r: rFrac,
  };
}

export type AnnotationId =
  | "title"
  | "status"
  | "location"
  | "cv"
  | "cta"
  | "contact";

export type AnnDef = {
  id: AnnotationId;
  dx: number;
  dy: number;
  dir: 1 | -1;
  uw: number;
  sub?: boolean;
  href?: string;
  d: number;
};

export const STAGGER = 0.5;
export const LINE_DUR = 1.1;

export const ANNS: AnnDef[] = [
  {
    id: "title",
    dx: -0.1,
    dy: -0.23,
    dir: 1,
    uw: 148,
    sub: true,
    d: 0,
  },
  {
    id: "status",
    dx: 0.21,
    dy: 0.05,
    dir: -1,
    uw: 88,
    d: 0.25,
  },
  {
    id: "location",
    dx: -0.13,
    dy: 0.26,
    dir: 1,
    uw: 120,
    sub: true,
    d: 0.55,
  },
  {
    id: "cv",
    dx: 0.05,
    dy: 0.31,
    dir: -1,
    uw: 88,
    href: siteConfig.cvUrl,
    d: 0.8,
  },
  {
    id: "cta",
    dx: 0.13,
    dy: 0.21,
    dir: -1,
    uw: 96,
    href: "#projects",
    d: 0.9,
  },
  {
    id: "contact",
    dx: -0.05,
    dy: 0.4,
    dir: 1,
    uw: 88,
    href: "#contact",
    d: 1.0,
  },
];
