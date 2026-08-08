import type { skillCategories } from "./skill-categories";

export type SkillCategory = (typeof skillCategories)[number];

export type CategoryKey = SkillCategory["key"];
