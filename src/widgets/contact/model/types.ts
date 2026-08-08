import type { LucideIcon } from "lucide-react";

export type Easing = [number, number, number, number];

export type FadeUpProps = {
  initial: { opacity: number; y: number };
  animate: { opacity: number; y: number };
  transition: { duration: number; delay: number; ease: Easing };
};

export type FadeUp = (delay: number) => FadeUpProps;

export type ContactLink = {
  href: string;
  icon: LucideIcon;
  text: string;
  delay: number;
};

export type SocialLink = {
  href: string;
  icon: LucideIcon;
  label: string;
};
