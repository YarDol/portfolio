export const navItems = [
  "about",
  "experience",
  "projects",
  "lab",
  "posts",
  "contact",
] as const;

export type NavItem = (typeof navItems)[number];
