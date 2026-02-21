import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { siteConfig } from "@/lib/constants";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "de" ? "Nutzungsbedingungen" : "Terms of Use",
    robots: { index: false },
  };
}

const en = {
  back: "← Back to portfolio",
  title: "Terms of Use",
  updated: "Last updated: February 2026",
  sections: [
    {
      heading: "1. Acceptance",
      body: `By accessing this portfolio website (yaroslavdolhushyn.dev), you agree to these Terms of Use. If you do not agree, please do not use the site. These terms apply alongside the Privacy Policy, which is incorporated by reference.`,
    },
    {
      heading: "2. Purpose of the Site",
      body: `This website is a personal portfolio showcasing the professional work, skills, and background of Yaroslav Dolhushyn. It is provided for informational purposes only and does not constitute a commercial offering, employment contract, or binding professional engagement.`,
    },
    {
      heading: "3. AI-Powered Features",
      body: `This site includes experimental AI features:\n\n• AI Chat — answers questions about Yaroslav's background using a language model. Responses are generated automatically and may not always be accurate or complete.\n• Voice Chat — allows spoken interaction with the AI assistant. Audio is processed by third-party APIs (Groq, ElevenLabs) and is not stored.\n\nThese features are provided "as is" for demonstration purposes. Do not rely on AI-generated responses as professional or legal advice. The operator makes no guarantees regarding accuracy, availability, or fitness for a particular purpose.`,
    },
    {
      heading: "4. Intellectual Property",
      body: `All content on this site — including text, design, code, and media — is the property of Yaroslav Dolhushyn unless otherwise stated. You may not reproduce, redistribute, or use any content commercially without prior written permission.\n\nProject descriptions and experience information represent Yaroslav's own contributions to past professional engagements and do not reveal confidential client information.`,
    },
    {
      heading: "5. Limitation of Liability",
      body: `To the fullest extent permitted by applicable law, the operator shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of this website or its AI features, including but not limited to reliance on AI-generated content.\n\nThe site is provided without warranties of any kind, express or implied.`,
    },
    {
      heading: "6. External Links",
      body: `This site may contain links to third-party websites (GitHub, LinkedIn, external projects). These links are provided for convenience only. The operator has no control over and accepts no responsibility for the content or privacy practices of external sites.`,
    },
    {
      heading: "7. Governing Law",
      body: `These terms are governed by the laws of the Federal Republic of Germany. Any disputes shall be subject to the exclusive jurisdiction of the competent courts in Germany, unless mandatory consumer protection laws in your country of residence require otherwise.`,
    },
    {
      heading: "8. Contact",
      body: `For questions about these terms, please contact:\n${siteConfig.email}`,
    },
    {
      heading: "9. Changes",
      body: `The operator reserves the right to update these Terms of Use at any time. The "last updated" date reflects the most recent revision. Continued use of the site after changes constitutes acceptance of the revised terms.`,
    },
  ],
};

const de: typeof en = {
  back: "← Zurück zum Portfolio",
  title: "Nutzungsbedingungen",
  updated: "Zuletzt aktualisiert: Februar 2026",
  sections: [
    {
      heading: "1. Geltungsbereich",
      body: `Mit dem Zugriff auf diese Portfolio-Website (yaroslavdolhushyn.dev) stimmen Sie diesen Nutzungsbedingungen zu. Wenn Sie nicht zustimmen, nutzen Sie die Website bitte nicht. Diese Bedingungen gelten zusammen mit der Datenschutzerklärung, auf die hiermit verwiesen wird.`,
    },
    {
      heading: "2. Zweck der Website",
      body: `Diese Website ist ein persönliches Portfolio, das die berufliche Arbeit, Fähigkeiten und den Werdegang von Yaroslav Dolhushyn präsentiert. Sie dient ausschließlich Informationszwecken und stellt kein kommerzielles Angebot, keinen Arbeitsvertrag oder eine verbindliche berufliche Verpflichtung dar.`,
    },
    {
      heading: "3. KI-gestützte Funktionen",
      body: `Diese Website enthält experimentelle KI-Funktionen:\n\n• KI-Chat – beantwortet Fragen zu Yaroslavs Hintergrund mithilfe eines Sprachmodells. Antworten werden automatisch generiert und sind möglicherweise nicht immer korrekt oder vollständig.\n• Sprach-Chat – ermöglicht gesprochene Interaktion mit dem KI-Assistenten. Audiodaten werden von Drittanbieter-APIs (Groq, ElevenLabs) verarbeitet und nicht gespeichert.\n\nDiese Funktionen werden „wie besehen" zu Demonstrationszwecken bereitgestellt. KI-generierte Antworten stellen keine professionelle oder rechtliche Beratung dar. Der Betreiber übernimmt keine Garantie für Richtigkeit, Verfügbarkeit oder Eignung für einen bestimmten Zweck.`,
    },
    {
      heading: "4. Geistiges Eigentum",
      body: `Alle Inhalte dieser Website – einschließlich Texte, Design, Code und Medien – sind Eigentum von Yaroslav Dolhushyn, sofern nicht anders angegeben. Eine Vervielfältigung, Weitergabe oder kommerzielle Nutzung von Inhalten ist ohne vorherige schriftliche Genehmigung nicht gestattet.\n\nProjektbeschreibungen und Erfahrungsangaben basieren auf Yaroslavs eigenen Beiträgen zu früheren beruflichen Tätigkeiten und enthalten keine vertraulichen Kundeninformationen.`,
    },
    {
      heading: "5. Haftungsbeschränkung",
      body: `Soweit gesetzlich zulässig, haftet der Betreiber nicht für direkte, indirekte, zufällige oder Folgeschäden, die aus der Nutzung dieser Website oder ihrer KI-Funktionen entstehen, einschließlich der Nutzung KI-generierter Inhalte.\n\nDie Website wird ohne jegliche ausdrückliche oder stillschweigende Gewährleistung bereitgestellt.`,
    },
    {
      heading: "6. Externe Links",
      body: `Diese Website kann Links zu Websites Dritter enthalten (GitHub, LinkedIn, externe Projekte). Diese Links dienen lediglich der Bequemlichkeit. Der Betreiber hat keine Kontrolle über externe Websites und übernimmt keine Verantwortung für deren Inhalte oder Datenschutzpraktiken.`,
    },
    {
      heading: "7. Anwendbares Recht",
      body: `Diese Nutzungsbedingungen unterliegen dem Recht der Bundesrepublik Deutschland. Für etwaige Streitigkeiten sind die zuständigen deutschen Gerichte ausschließlich zuständig, sofern nicht zwingende Verbraucherschutzvorschriften Ihres Wohnsitzlandes anderes vorschreiben.`,
    },
    {
      heading: "8. Kontakt",
      body: `Bei Fragen zu diesen Nutzungsbedingungen wenden Sie sich bitte an:\n${siteConfig.email}`,
    },
    {
      heading: "9. Änderungen",
      body: `Der Betreiber behält sich das Recht vor, diese Nutzungsbedingungen jederzeit zu aktualisieren. Das Datum „Zuletzt aktualisiert" gibt den Stand der letzten Überarbeitung an. Die weitere Nutzung der Website nach Änderungen gilt als Zustimmung zu den aktualisierten Bedingungen.`,
    },
  ],
};

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const content = locale === "de" ? de : en;

  return (
    <>
      <Header />
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
              <h2 className="text-base font-semibold mb-3">
                {section.heading}
              </h2>
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
