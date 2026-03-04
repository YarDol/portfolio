"use client";

import { useTranslations } from "next-intl";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { patterns } from "@/components/ui/project-patterns";
import type { projects } from "@/lib/projects";

type Project = (typeof projects)[number];

function useTilt(strength = 5) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [strength, -strength]), {
    stiffness: 280,
    damping: 28,
  });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-strength, strength]), {
    stiffness: 280,
    damping: 28,
  });
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const onMouseLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };
  return { rotateX, rotateY, onMouseMove, onMouseLeave };
}

function BrowserVisual({
  index,
  gradient,
  tall = false,
}: {
  index: number;
  gradient: string;
  tall?: boolean;
}) {
  const pattern = patterns[index % patterns.length];

  return (
    <div
      className={`absolute inset-x-3 bottom-0 top-3 flex flex-col overflow-hidden rounded-t-lg border border-border/50 shadow-sm ${tall ? "inset-x-5 top-5 rounded-t-xl" : ""}`}
    >
      <div className="flex shrink-0 items-center gap-1.5 border-b border-border/50 bg-card/80 px-3 py-2 backdrop-blur-sm">
        <span className="h-2 w-2 rounded-full bg-foreground/15" />
        <span className="h-2 w-2 rounded-full bg-foreground/15" />
        <span className="h-2 w-2 rounded-full bg-foreground/15" />
        <div className="ml-2 h-2.5 w-28 rounded-sm bg-border/70" />
      </div>

      <div
        className={`relative flex flex-1 items-center justify-center overflow-hidden bg-linear-to-br ${gradient}`}
      >
        <svg
          viewBox="0 0 380 160"
          className="h-full w-full text-accent/30"
          preserveAspectRatio="xMidYMid slice"
        >
          {pattern}
        </svg>
      </div>
    </div>
  );
}

function Stack({ stack }: { stack: readonly string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-3">
      {stack.map((tech) => (
        <span
          key={tech}
          className="rounded bg-foreground/5 px-2 py-0.5 font-mono text-[10px] text-foreground/45"
        >
          {tech}
        </span>
      ))}
    </div>
  );
}

function RoleLabel({ label }: { label: string }) {
  return (
    <span className="font-mono text-[10px] tracking-widest text-muted/50 uppercase">
      {`
      // ${label}`}
    </span>
  );
}

export function FeaturedCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
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
        className="group relative overflow-hidden rounded-2xl border border-border"
      >
        <div className="flex flex-col-reverse  md:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-4 p-8">
            <div className="flex flex-wrap items-baseline gap-3 justify-between">
              <h3 className="text-base sm:text-2xl font-bold tracking-tight">
                {t(project.titleKey)}
              </h3>
              <RoleLabel label={t(project.roleKey)} />
            </div>
            <p className="text-sm leading-relaxed text-muted">
              {t(project.descKey)}
            </p>
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

export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
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
        className="group relative overflow-hidden rounded-2xl border border-border"
      >
        <div className="relative h-44 overflow-hidden border-b border-border bg-muted/5">
          <BrowserVisual index={index} gradient={project.gradient} />
        </div>

        <div className="p-5 flex flex-col gap-4">
          <div className="flex items-baseline  justify-between flex-col sm:flex-row gap-3">
            <h3 className="text-base font-bold">{t(project.titleKey)}</h3>
            <RoleLabel label={t(project.roleKey)} />
          </div>
          <p className="text-sm leading-relaxed text-muted ">
            {t(project.descKey)}
          </p>
          <Stack stack={project.stack} />
        </div>
      </motion.div>
    </div>
  );
}
