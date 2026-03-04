"use client";

import { motion } from "motion/react";
import { MapPin, type LucideIcon } from "lucide-react";

type FadeUpProps = {
  initial: { opacity: number; y: number };
  animate: { opacity: number; y: number };
  transition: { duration: number; delay: number; ease: [number, number, number, number] };
};

type ContactLink = {
  href: string;
  icon: LucideIcon;
  text: string;
  delay: number;
};

type SocialLink = {
  href: string;
  icon: LucideIcon;
  label: string;
};

type ContactSidebarProps = {
  availability: string;
  based: string;
  email: string;
  phone: string;
  socialLinks: SocialLink[];
  contactLinks: ContactLink[];
  fadeUp: (delay: number) => FadeUpProps;
  isInView: boolean;
};

export function ContactSidebar({
  availability,
  based,
  contactLinks,
  socialLinks,
  fadeUp,
  isInView,
}: ContactSidebarProps) {
  return (
    <div className="md:col-span-2 flex flex-col gap-8 md:pt-4">
      <motion.div {...fadeUp(0.18)} className="flex items-start gap-3">
        <span className="relative flex h-4 w-4 shrink-0 items-center justify-center mt-1">
          <span className="absolute inset-0 rounded-full border border-border transition-colors duration-200 group-hover:border-accent/50" />
          <span className="h-1.5 w-1.5 rounded-full bg-accent/40 transition-all duration-200 group-hover:bg-accent group-hover:scale-125" />
        </span>
        <p className="text-sm text-muted leading-relaxed hover:text-foreground group">
          {availability}
        </p>
      </motion.div>

      <motion.div
        initial={{ scaleX: 0, originX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.5, delay: 0.22 }}
        className="h-px bg-border/60"
      />

      <div className="space-y-4">
        {contactLinks.map(({ href, icon: Icon, text, delay }) => (
          <motion.a
            key={text}
            href={href}
            {...fadeUp(delay)}
            className="flex items-center gap-3 text-sm text-muted transition-colors hover:text-foreground group"
          >
            <Icon className="h-4 w-4 shrink-0 transition-colors group-hover:text-accent" />
            {text}
          </motion.a>
        ))}
        <motion.div
          {...fadeUp(0.35)}
          className="flex items-center gap-3 text-sm text-muted"
        >
          <MapPin className="h-4 w-4 shrink-0" />
          {based}
        </motion.div>
      </div>

      <motion.div {...fadeUp(0.4)} className="flex gap-2">
        {socialLinks.map(({ href, icon: Icon, label }) => (
          <motion.a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.93 }}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 text-muted transition-colors hover:border-accent/60 hover:text-accent"
            aria-label={label}
          >
            <Icon className="h-3.5 w-3.5" />
          </motion.a>
        ))}
      </motion.div>
    </div>
  );
}
