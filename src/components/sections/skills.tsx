"use client";

import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/ui/section-heading";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const skillCategories = [
  {
    key: "frontend" as const,
    skills: [
      "React.js",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Zustand",
      "Redux",
      "MobX",
      "TanStack Query",
      "Radix UI",
      "MUI",
      "Three.js",
      "WebSockets",
    ],
  },
  {
    key: "backend" as const,
    skills: [
      "Node.js",
      "Nest.js",
      "Express.js",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "Kafka",
      "TypeORM",
      "Prisma",
      "GraphQL",
      "REST API",
      "Microservices",
      "OpenAI / LLM",
    ],
  },
  {
    key: "mobile" as const,
    skills: [
      "React Native",
      "Native Modules",
      "Deep Linking",
      "Push Notifications",
      "Expo",
      "App Store Deployment",
    ],
  },
  {
    key: "devops" as const,
    skills: [
      "AWS (S3, Lambda, RDS)",
      "Docker",
      "GitHub Actions",
      "Nginx",
      "Vercel",
      "Cloudflare",
      "VPS",
      "PM2",
    ],
  },
  {
    key: "tools" as const,
    skills: [
      "Git",
      "Figma",
      "Sentry",
      "Postman",
      "Swagger",
      "Cursor",
      "Firebase",
      "Cloud Code",
      "Intercom",
    ],
  },
  {
    key: "analytics" as const,
    skills: [
      "Crashlytics",
      "Amplitude",
      "GA4",
      "Meta ADs",
      "Google Ads",
      "Instabug",
      "Mixpanel",
      "Hotjar",
    ],
  },
];

export function Skills() {
  const t = useTranslations("Skills");

  return (
    <section className="border-t border-border py-24">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading label={t("label")} title={t("title")} />

        <div className="grid gap-8 md:grid-cols-2">
          {skillCategories.map(({ key, skills }, categoryIndex) => (
            <ScrollReveal key={key} delay={categoryIndex * 0.1}>
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="mb-4 font-mono text-sm font-medium tracking-wide text-accent uppercase">
                  {t(key)}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-border bg-background px-3 py-1 text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
