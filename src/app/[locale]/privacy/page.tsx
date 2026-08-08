import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { routing } from "@/shared/i18n";
import { PrivacyPage, privacyTitle } from "@/views/privacy";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const resolved = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;

  return {
    title: privacyTitle[resolved],
    robots: { index: false },
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return <PrivacyPage locale={locale} />;
}
