import type { MetadataRoute } from "next";
import { siteConfig } from "@/shared/config";
import { routing } from "@/shared/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [""];

  return routes.flatMap((route) =>
    routing.locales.map((locale) => ({
      url: `${siteConfig.url}${locale === "en" ? "" : `/${locale}`}${route}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [
            l,
            `${siteConfig.url}${l === "en" ? "" : `/${l}`}${route}`,
          ])
        ),
      },
    }))
  );
}
