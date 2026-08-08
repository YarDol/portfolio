"use client";

import { useTranslations } from "next-intl";
import { Linkedin, ArrowUpRight } from "lucide-react";
import type { LinkedInPost } from "../model/types";

type PostCardProps = {
  post: LinkedInPost;
};

export function PostCard({ post }: PostCardProps) {
  const t = useTranslations("LinkedInPosts");

  return (
    <a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex h-full flex-col gap-4 border border-border p-6 transition-colors hover:border-foreground/25"
    >
      <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-muted/50 uppercase">
        <Linkedin className="h-3 w-3" />
      </span>

      <p className="text-base font-bold leading-snug tracking-tight">
        {t(post.hookKey)}
      </p>

      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="bg-foreground/5 px-2 py-0.5 font-mono text-[10px] text-foreground/45"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <span className="mt-auto inline-flex items-center gap-1.5 font-mono text-xs text-accent transition-colors group-hover:text-foreground">
        {t("cta")}
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </a>
  );
}
