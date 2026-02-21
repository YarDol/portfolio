"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/constants";
import { Github, Linkedin, Mail } from "lucide-react";

const socialLinks = [
  { href: siteConfig.links.github, icon: Github, label: "GitHub" },
  { href: siteConfig.links.linkedin, icon: Linkedin, label: "LinkedIn" },
  { href: `mailto:${siteConfig.email}`, icon: Mail, label: "Email" },
] as const;

export function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 sm:flex-row sm:justify-between">
        <div className="flex flex-col items-center gap-1.5 sm:items-start">
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} {siteConfig.name}
          </p>
          <div className="flex gap-3">
            <Link
              href="/privacy"
              className="text-xs text-muted hover:text-accent transition-colors"
            >
              {t("privacy")}
            </Link>
            <span className="text-xs text-muted/40">·</span>
            <Link
              href="/terms"
              className="text-xs text-muted hover:text-accent transition-colors"
            >
              {t("terms")}
            </Link>
          </div>
        </div>

        <div className="flex gap-3">
          {socialLinks.map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("mailto") ? undefined : "_blank"}
              rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:border-accent hover:text-accent"
              aria-label={label}
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
