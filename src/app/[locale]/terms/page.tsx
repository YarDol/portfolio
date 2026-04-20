import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import type { Locale } from "next-intl";
import { LegalContent } from "@/components/legal/legal-content";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: "Terms" });
  return {
    title: t("title"),
    robots: { index: false },
  };
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations("Terms");
  const sections = t.raw("sections") as Array<{ heading: string; body: string }>;

  return (
    <LegalContent
      back={t("back")}
      title={t("title")}
      updated={t("updated")}
      sections={sections}
    />
  );
}
