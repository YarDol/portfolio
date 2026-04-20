"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { useTilt } from "@/hooks/use-tilt";
import type { projects } from "@/lib/projects";
import { BrowserVisual } from "./browser-visual";
import { Stack } from "./stack";
import { RoleLabel } from "./role-label";

type Project = (typeof projects)[number];

export function FeaturedCard({ project, index }: { project: Project; index: number }) {
  const t = useTranslations("Projects");
  const { rotateX, rotateY, onMouseMove, onMouseLeave } = useTilt(4);

  return (
    <div style={{ perspective: 1200 }} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative overflow-hidden rounded-2xl border border-border"
      >
        <div className="flex flex-col-reverse md:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-4 p-8">
            <div className="flex flex-wrap items-baseline gap-3 justify-between">
              <h3 className="text-base sm:text-2xl font-bold tracking-tight">
                {t(project.titleKey)}
              </h3>
              <RoleLabel label={t(project.roleKey)} />
            </div>
            <p className="text-sm leading-relaxed text-muted">{t(project.descKey)}</p>
            <Stack stack={project.stack} />
          </div>

          <div className="relative h-64 shrink-0 overflow-hidden border-t border-border md:h-auto md:w-96 md:border-t-0 md:border-l bg-muted/5">
            <BrowserVisual index={index} gradient={project.gradient} tall />
            <div className="absolute inset-y-0 left-0 w-8 bg-linear-to-r from-background/20 to-transparent pointer-events-none z-10 hidden md:block" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const t = useTranslations("Projects");
  const { rotateX, rotateY, onMouseMove, onMouseLeave } = useTilt(5);

  return (
    <div style={{ perspective: 1000 }} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative overflow-hidden rounded-2xl border border-border"
      >
        <div className="relative h-44 overflow-hidden border-b border-border bg-muted/5">
          <BrowserVisual index={index} gradient={project.gradient} />
        </div>

        <div className="p-5 flex flex-col gap-4">
          <div className="flex items-baseline justify-between flex-col sm:flex-row gap-3">
            <h3 className="text-base font-bold">{t(project.titleKey)}</h3>
            <RoleLabel label={t(project.roleKey)} />
          </div>
          <p className="text-sm leading-relaxed text-muted">{t(project.descKey)}</p>
          <Stack stack={project.stack} />
        </div>
      </motion.div>
    </div>
  );
}
