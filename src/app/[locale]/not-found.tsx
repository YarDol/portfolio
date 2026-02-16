import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFoundPage() {
  const t = useTranslations("NotFound");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">{t("title")}</h1>
      <p className="mt-2 text-neutral-500">{t("description")}</p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-neutral-900 px-6 py-3 text-white transition-colors hover:bg-neutral-700"
      >
        {t("backHome")}
      </Link>
    </main>
  );
}
