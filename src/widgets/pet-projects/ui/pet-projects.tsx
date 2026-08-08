"use client";

import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/shared/ui";
import { petProjects, PetProjectCard } from "@/entities/pet-project";

export function PetProjects() {
  const t = useTranslations("PetProjects");

  return (
    <section id="lab" className="border-t border-border py-24">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal className="mb-12">
          <p className="font-mono text-xs tracking-widest text-accent uppercase mb-2">
            {t("label")}
          </p>
          <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-3 text-muted text-sm max-w-lg">{t("subtitle")}</p>
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-2">
          {petProjects.map((project, i) => (
            <ScrollReveal key={project.titleKey} delay={(i % 2) * 0.1}>
              <PetProjectCard project={project} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
