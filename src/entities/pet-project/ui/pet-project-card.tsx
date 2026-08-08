"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ExternalLink, Github } from "lucide-react";
import type { PetProject } from "../model/types";

type PetProjectCardProps = {
  project: PetProject;
};

export function PetProjectCard({ project }: PetProjectCardProps) {
  const t = useTranslations("PetProjects");

  return (
    <div className="group relative overflow-hidden border border-border">
      <div className="relative aspect-video overflow-hidden border-b border-border bg-muted/5">
        <Image
          src={project.image}
          alt={t(project.titleKey)}
          fill
          className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(min-width: 768px) 50vw, 100vw"
        />
      </div>

      <div className="p-5 flex flex-col gap-4">
        <h3 className="text-base font-bold">{t(project.titleKey)}</h3>
        <p className="text-sm leading-relaxed text-muted">
          {t(project.descKey)}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="bg-foreground/5 px-2 py-0.5 font-mono text-[10px] text-foreground/45"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center gap-4 pt-1">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-accent transition-colors hover:text-foreground"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {t("live")}
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-muted transition-colors hover:text-foreground"
            >
              <Github className="h-3.5 w-3.5" />
              {t("code")}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
