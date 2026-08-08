"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { useTilt } from "@/shared/lib/use-tilt";
import type { Project } from "../model/types";
import { ProjectVisual } from "./project-visual";
import { ProjectStack } from "./project-stack";
import { ProjectRoleLabel } from "./project-role-label";

type ProjectCardProps = {
  project: Project;
  index: number;
};

export function ProjectCard({ project, index }: ProjectCardProps) {
  const t = useTranslations("Projects");
  const { rotateX, rotateY, onMouseMove, onMouseLeave } = useTilt(5);

  return (
    <div
      style={{ perspective: 1000 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative overflow-hidden border border-border"
      >
        <div className="relative h-44 overflow-hidden border-b border-border bg-muted/5">
          <ProjectVisual index={index} gradient={project.gradient} />
        </div>

        <div className="p-5 flex flex-col gap-4">
          <div className="flex items-baseline  justify-between flex-col sm:flex-row gap-3">
            <h3 className="text-base font-bold">{t(project.titleKey)}</h3>
            <ProjectRoleLabel label={t(project.roleKey)} />
          </div>
          <p className="text-sm leading-relaxed text-muted ">
            {t(project.descKey)}
          </p>
          <ProjectStack stack={project.stack} />
        </div>
      </motion.div>
    </div>
  );
}
