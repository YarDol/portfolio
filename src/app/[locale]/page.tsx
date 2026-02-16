import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { PersonJsonLd } from "@/components/seo/json-ld";
import { Header } from "@/components/layout/header";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { Experience } from "@/components/sections/experience";
import { Projects } from "@/components/sections/projects";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/layout/footer";

type Props = {
  params: Promise<{ locale: string }>;
};

export default function HomePage({ params }: Props) {
  const { locale } = use(params);
  if (!hasLocale(routing.locales, locale)) return null;
  setRequestLocale(locale);

  return (
    <>
      <PersonJsonLd locale={locale} />
      <Header />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Contact />
      <Footer />
    </>
  );
}
