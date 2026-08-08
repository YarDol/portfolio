import { siteConfig } from "@/shared/config";

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

/** Seconds between consecutive annotation lines. */
export const STAGGER = 0.5;
/** Seconds for one line to draw itself. */
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
