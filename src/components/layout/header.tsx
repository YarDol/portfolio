"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { useState } from "react";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";
import { usePathname } from "@/i18n/navigation";

const navItems = ["about", "experience", "projects", "contact"] as const;

export function Header() {
  const t = useTranslations("Navigation");
  const [hovered, setHovered] = useState<string | null>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="fixed top-4 left-0 right-0 z-50">
      <div className="relative flex items-center justify-between px-6">
        <a
          href={isHome ? "#hero" : "/"}
          className="font-mono text-sm font-bold tracking-tight relative z-10"
        >
          YD.
        </a>

        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-0.5 rounded-full border border-border bg-card/80 backdrop-blur-md px-2 py-1.5">
          {navItems.map((item) => (
            <a
              key={item}
              href={isHome ? `#${item}` : `/#${item}`}
              className="relative px-4 py-1.5 text-sm text-muted transition-colors hover:text-foreground"
              onMouseEnter={() => setHovered(item)}
              onMouseLeave={() => setHovered(null)}
            >
              {hovered === item && (
                <motion.div
                  layoutId="nav-highlight"
                  className="absolute inset-0 rounded-full bg-foreground/8"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.35 }}
                />
              )}
              <span className="relative z-10">{t(item)}</span>
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 relative z-10">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
