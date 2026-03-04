"use client";

import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { projects } from "@/lib/projects";
import { FeaturedCard, ProjectCard } from "./projects/project-card";

export function Projects() {
  const t = useTranslations("Projects");

  const [featured, ...rest] = projects;

  return (
    <section id="projects" className="border-t border-border py-24">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal className="mb-12">
          <p className="font-mono text-xs tracking-widest text-accent uppercase mb-2">
            {t("label")}
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-3 text-muted text-sm max-w-lg">{t("subtitle")}</p>
        </ScrollReveal>

        <ScrollReveal className="mb-6">
          <FeaturedCard project={featured} index={0} />
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-2">
          {rest.map((project, i) => (
            <ScrollReveal key={project.titleKey} delay={(i % 2) * 0.1}>
              <ProjectCard project={project} index={i + 1} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
