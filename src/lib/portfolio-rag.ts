import en from "@/messages/en.json";
import de from "@/messages/de.json";
import { siteConfig } from "@/lib/constants";
import { skillCategories } from "@/lib/skills";

type Locale = "en" | "de";
const messages: Record<Locale, typeof en> = { en, de };

function msg(locale: Locale) {
  return messages[locale] ?? messages.en;
}

export function getProfile(locale: Locale) {
  const m = msg(locale);
  return {
    name: "Yaroslav Dolhushyn",
    role: m.Hero.role,
    location: siteConfig.location,
    workAuthorization: "Full working rights in Germany (§24)",
    experience: m.About.highlights.experience,
    education: `${m.About.highlights.education} ${m.About.highlights.educationLabel}`,
    summary: m.About.description,
    bio: [m.About.bio1, m.About.bio2],
    highlights: {
      apps: `${m.About.highlights.apps} ${m.About.highlights.appsLabel}`,
      users: `${m.About.highlights.users} ${m.About.highlights.usersLabel}`,
    },
    languages: [
      "English (B2)",
      "German (A1)",
      "Ukrainian (Native)",
      "Russian (Fluent)",
    ],
    traits: [
      "End-to-end ownership",
      "Production mindset",
      "Performance-focused",
      "Mentorship experience",
      "Startup-ready",
    ],
  };
}

export function getSkills(locale: Locale) {
  const m = msg(locale);
  const labels: Record<string, string> = {
    frontend: m.Skills.frontend,
    backend: m.Skills.backend,
    mobile: m.Skills.mobile,
    devops: m.Skills.devops,
    tools: m.Skills.tools,
    analytics: m.Skills.analytics,
  };

  return skillCategories.map(({ key, skills }) => ({
    category: labels[key] ?? key,
    skills: [...skills],
  }));
}

export function getExperience(locale: Locale) {
  const m = msg(locale);
  const k = m.Experience.kevych;
  return {
    current: {
      role: k.role,
      company: k.company,
      location: k.location,
      period: k.period,
      achievements: Object.values(k.items),
    },
    certifications: [
      m.Education.aws,
      m.Education["front-end"],
      m.Education["java-script"],
    ],
  };
}

export function getProjects(locale: Locale) {
  const m = msg(locale);
  return Object.values(m.Projects.items).map((p) => ({
    title: p.title,
    description: p.description,
    role: p.role,
  }));
}

export function getEducation(locale: Locale) {
  const m = msg(locale);
  return {
    degrees: [
      { ...m.Education.master, level: "Master" },
      { ...m.Education.bachelor, level: "Bachelor" },
      { ...m.Education.exchange, level: "Exchange" },
      { ...m.Education.junior, level: "Junior Bachelor" },
    ],
    certifications: [
      m.Education.aws,
      m.Education["front-end"],
      m.Education["java-script"],
    ],
  };
}

export function getContactInfo(locale: Locale) {
  const m = msg(locale);
  return {
    email: siteConfig.email,
    phone: siteConfig.phone,
    location: siteConfig.location,
    availability: m.Contact.availability,
    github: siteConfig.links.github,
    linkedin: siteConfig.links.linkedin,
    website: siteConfig.url,
  };
}
