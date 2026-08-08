import { Mail, Phone, Github, Linkedin, Instagram } from "lucide-react";
import { siteConfig } from "@/shared/config";
import type { ContactLink, SocialLink } from "../model/types";

export const contactLinks: ContactLink[] = [
  {
    href: `mailto:${siteConfig.email}`,
    icon: Mail,
    text: siteConfig.email,
    delay: 0.25,
  },
  {
    href: `tel:${siteConfig.phone.replace(/\s/g, "")}`,
    icon: Phone,
    text: siteConfig.phone,
    delay: 0.3,
  },
];

export const socialLinks: SocialLink[] = [
  { href: siteConfig.links.github, icon: Github, label: "GitHub" },
  { href: siteConfig.links.linkedin, icon: Linkedin, label: "LinkedIn" },
  { href: siteConfig.links.instagram, icon: Instagram, label: "Instagram" },
];
