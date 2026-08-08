import { Github, Linkedin, Mail, Instagram } from "lucide-react";
import { siteConfig } from "@/shared/config";

export const socialLinks = [
  { href: siteConfig.links.github, icon: Github, label: "GitHub" },
  { href: siteConfig.links.linkedin, icon: Linkedin, label: "LinkedIn" },
  { href: siteConfig.links.instagram, icon: Instagram, label: "Instagram" },
  { href: `mailto:${siteConfig.email}`, icon: Mail, label: "Email" },
] as const;
