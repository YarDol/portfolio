import { use } from "react";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/shared/i18n";
import { HomePage } from "@/views/home";

type Props = {
  params: Promise<{ locale: string }>;
};

export default function Page({ params }: Props) {
  const { locale } = use(params);
  if (!hasLocale(routing.locales, locale)) return null;
  setRequestLocale(locale);

  return <HomePage locale={locale} />;
}
