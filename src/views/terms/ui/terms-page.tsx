import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/shared/i18n";
import { LegalDocument } from "@/shared/ui";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { termsContent } from "../model/content";

export async function TermsPage({ locale }: { locale: string }) {
  const resolved = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;

  setRequestLocale(resolved);

  return (
    <>
      <Header />
      <LegalDocument content={termsContent[resolved]} />
      <Footer />
    </>
  );
}
