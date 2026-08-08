import en from "@/shared/i18n/messages/en.json";
import { siteConfig } from "@/shared/config";
import { skillCategories } from "@/entities/skill";

const skills = skillCategories
  .map((c) => `${c.key}: ${c.skills.join(", ")}`)
  .join("\n");

const projects = Object.values(en.Projects.items)
  .map((p) => `- ${p.title} (${p.role}): ${p.description}`)
  .join("\n");

const achievements = Object.values(en.Experience.kevych.items)
  .map((a) => `- ${a}`)
  .join("\n");

const education = [
  `${en.Education.master.degree} — ${en.Education.master.school} (${en.Education.master.period})`,
  `${en.Education.bachelor.degree} — ${en.Education.bachelor.school} (${en.Education.bachelor.period})`,
  `${en.Education.exchange.degree} — ${en.Education.exchange.school} (${en.Education.exchange.period})`,
  `${en.Education.junior.degree} — ${en.Education.junior.school} (${en.Education.junior.period})`,
].join("\n");

const certifications = [
  en.Education.aws,
  en.Education["front-end"],
  en.Education["java-script"],
].join(", ");

export const portfolioSnapshot = `
Name: Yaroslav Dolhushyn
Role: ${en.Hero.role1}
Location: ${siteConfig.location}
Work Authorization: Full working rights in Germany (§24)
Summary: ${en.About.description}
Bio: ${en.About.bio1} ${en.About.bio2}

KEY METRICS:
- ${en.About.highlights.experience} commercial experience
- ${en.About.highlights.apps} ${en.About.highlights.appsLabel}
- ${en.About.highlights.users} ${en.About.highlights.usersLabel}

LANGUAGES: English (B2), German (A1), Ukrainian (Native), Russian (Fluent)

SKILLS:
${skills}

CURRENT ROLE: ${en.Experience.kevych.role} at ${en.Experience.kevych.company}
Location: ${en.Experience.kevych.location}
Period: ${en.Experience.kevych.period}
ACHIEVEMENTS:
${achievements}

PROJECTS:
${projects}

EDUCATION:
${education}

CERTIFICATIONS: ${certifications}

CONTACT:
Email: ${siteConfig.email}
Phone: ${siteConfig.phone}
GitHub: ${siteConfig.links.github}
LinkedIn: ${siteConfig.links.linkedin}
`.trim();
