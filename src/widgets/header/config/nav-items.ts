/** Section ids, also used as `Navigation` translation keys. */
export const navItems = ["about", "experience", "projects", "contact"] as const;

export type NavItem = (typeof navItems)[number];
