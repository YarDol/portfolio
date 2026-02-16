"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { SectionHeading } from "@/components/ui/section-heading";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { projects } from "@/lib/projects";
import { ProjectPattern } from "@/components/ui/project-pattern";

export function Projects() {
  const t = useTranslations("Projects");

  return (
    <section id="projects" className="border-t border-border py-24">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          label={t("label")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project, i) => (
            <ScrollReveal key={project.titleKey} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card"
              >
                <ProjectPattern index={i} gradient={project.gradient} />

                <div className="p-6">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-bold">{t(project.titleKey)}</h3>
                    <span className="shrink-0 rounded-full border border-accent/20 bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                      {t(project.roleKey)}
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {t(project.descKey)}
                  </p>

                  {"metrics" in project && (
                    <p className="mt-3 text-xs font-medium text-accent">
                      {project.metrics}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-background px-2.5 py-0.5 text-xs text-muted"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
