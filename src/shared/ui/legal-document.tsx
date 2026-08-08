import { Link } from "@/shared/i18n";

export type LegalSection = {
  heading: string;
  body: string;
};

export type LegalDocumentContent = {
  back: string;
  title: string;
  updated: string;
  sections: LegalSection[];
};

/**
 * Renders a static legal document (privacy policy, terms of use, …).
 * Paragraphs are split on blank lines; single newlines are preserved.
 */
export function LegalDocument({ content }: { content: LegalDocumentContent }) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/"
        className="mb-8 inline-block text-sm text-muted hover:text-accent transition-colors"
      >
        {content.back}
      </Link>

      <h1 className="text-3xl font-bold tracking-tight mb-2">
        {content.title}
      </h1>
      <p className="text-sm text-muted mb-12">{content.updated}</p>

      <div className="space-y-10">
        {content.sections.map((section) => (
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
  );
}
