import { Link } from "@/i18n/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

interface LegalSection {
  heading: string;
  body: string;
}

interface LegalContentProps {
  back: string;
  title: string;
  updated: string;
  sections: LegalSection[];
}

export function LegalContent({ back, title, updated, sections }: LegalContentProps) {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href="/"
          className="mb-8 inline-block text-sm text-muted hover:text-accent transition-colors"
        >
          {back}
        </Link>

        <h1 className="text-3xl font-bold tracking-tight mb-2">{title}</h1>
        <p className="text-sm text-muted mb-12">{updated}</p>

        <div className="space-y-10">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-base font-semibold mb-3">{section.heading}</h2>
              <div className="space-y-3">
                {section.body.split("\n\n").map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-sm text-foreground/75 leading-relaxed whitespace-pre-line"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
