"use client";

import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/shared/ui";
import { linkedInPosts, PostCard } from "@/entities/linkedin-post";

export function LinkedInPosts() {
  const t = useTranslations("LinkedInPosts");

  return (
    <section id="posts" className="border-t border-border py-24">
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

        <div className="grid gap-6 sm:grid-cols-2">
          {linkedInPosts.map((post, i) => (
            <ScrollReveal key={post.url} delay={(i % 2) * 0.1}>
              <PostCard post={post} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
