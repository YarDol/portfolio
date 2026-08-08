"use client";

import { ScrollReveal } from "./scroll-reveal";

type Props = {
  title: string;
  subtitle?: string;
  label?: string;
};

export function SectionHeading({ title, subtitle, label }: Props) {
  return (
    <ScrollReveal className="mb-16 text-center">
      {label && (
        <p className="font-mono text-sm tracking-widest text-accent uppercase">
          {label}
        </p>
      )}
      <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-4 max-w-2xl text-muted">{subtitle}</p>
      )}
    </ScrollReveal>
  );
}
