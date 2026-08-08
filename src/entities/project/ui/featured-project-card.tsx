"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { useTilt } from "@/shared/lib/use-tilt";
import type { Project } from "../model/types";
import { ProjectVisual } from "./project-visual";
import { ProjectStack } from "./project-stack";
import { ProjectRoleLabel } from "./project-role-label";

type FeaturedProjectCardProps = {
  project: Project;
  index: number;
};

export function FeaturedProjectCard({
  project,
  index,
}: FeaturedProjectCardProps) {
  const t = useTranslations("Projects");
  const { rotateX, rotateY, onMouseMove, onMouseLeave } = useTilt(4);

  return (
    <div
      style={{ perspective: 1200 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative overflow-hidden border border-border"
      >
        <div className="flex flex-col-reverse  md:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-4 p-8">
            <div className="flex flex-wrap items-baseline gap-3 justify-between">
              <h3 className="text-base sm:text-2xl font-bold tracking-tight">
                {t(project.titleKey)}
              </h3>
              <ProjectRoleLabel label={t(project.roleKey)} />
            </div>
            <p className="text-sm leading-relaxed text-muted">
              {t(project.descKey)}
            </p>
            <ProjectStack stack={project.stack} />
          </div>

          <div className="relative h-64 shrink-0 overflow-hidden border-t border-border md:h-auto md:w-96 md:border-t-0 md:border-l bg-muted/5">
            <ProjectVisual index={index} gradient={project.gradient} tall />
            <div className="absolute inset-y-0 left-0 w-8 bg-linear-to-r from-background/20 to-transparent pointer-events-none z-10 hidden md:block" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
