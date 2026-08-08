import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { routing } from "@/shared/i18n";
import { TermsPage, termsTitle } from "@/views/terms";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const resolved = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;

  return {
    title: termsTitle[resolved],
    robots: { index: false },
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return <TermsPage locale={locale} />;
}
