import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { siteConfig } from "@/lib/constants";
import type { Metadata } from "next";
import { Locale } from "next-intl";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "de" ? "Datenschutzerklärung" : "Privacy Policy",
    robots: { index: false },
  };
}

const en = {
  back: "← Back to portfolio",
  title: "Privacy Policy",
  updated: "Last updated: February 2026",
  sections: [
    {
      heading: "1. Controller",
      body: `The controller responsible for data processing on this website is:\n\nYaroslav Dolhushyn\nSangerhausen, Germany\nEmail: ${siteConfig.email}\nPhone: ${siteConfig.phone}`,
    },
    {
      heading: "2. Contact Form",
      body: `When you submit the contact form, we collect your name, email address, and message. This data is transmitted directly to the controller's email address and is used solely to respond to your inquiry.\n\nLegal basis: Article 6(1)(b) GDPR (performance of a pre-contractual measure at the data subject's request). Data is retained only as long as needed to handle your inquiry and is then deleted.`,
    },
    {
      heading: "3. Analytics — Google Analytics 4",
      body: `This website uses Google Analytics 4 (GA4), a web analytics service provided by Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland. GA4 collects anonymised usage data (pages visited, session duration, device type, approximate location based on IP) to help understand how visitors interact with the site.\n\nGA4 is only loaded after you have given your explicit consent via the cookie banner.\n\nLegal basis: Article 6(1)(a) GDPR (consent). You may withdraw consent at any time by clearing the cookie-consent entry in your browser's local storage.\n\nData may be transferred to Google LLC servers in the United States under standard contractual clauses. For more information, see Google's Privacy Policy at https://policies.google.com/privacy.`,
    },
    {
      heading: "4. AI Chat",
      body: `The portfolio includes an AI-powered chat assistant. Messages you send are transmitted to the OpenAI API (OpenAI, L.L.C., San Francisco, USA) to generate a response. Messages are processed in real time and are not stored on our servers beyond the active browser session.\n\nLegal basis: Article 6(1)(f) GDPR (legitimate interest in providing an interactive portfolio experience). Data is not used to train AI models.\n\nFor more information, see OpenAI's Privacy Policy at https://openai.com/policies/privacy-policy.`,
    },
    {
      heading: "5. Voice Chat",
      body: `The portfolio includes an optional voice chat feature. When you use it:\n\n• Your microphone audio is recorded locally in your browser and sent to Groq, Inc. (USA) for speech-to-text transcription.\n• The transcribed text is sent to Groq's LLM API to generate a response.\n• Optionally, the text response is converted to speech via ElevenLabs, Inc. (USA).\n\nAudio recordings and transcripts are not stored on our servers. Processing is transient and used only to generate the reply.\n\nLegal basis: Article 6(1)(a) GDPR (your explicit action of activating the microphone constitutes consent). You may stop voice processing at any time by closing the voice widget.\n\nFor more information, see:\n• Groq Privacy Policy: https://groq.com/privacy-policy/\n• ElevenLabs Privacy Policy: https://elevenlabs.io/privacy`,
    },
    {
      heading: "6. Cookies & Local Storage",
      body: `This website uses browser local storage (not cookies) to remember your cookie consent preference. No tracking cookies are placed without your consent. If you accept analytics cookies, Google Analytics 4 may set its own cookies (__ga, __ga_*) in your browser to distinguish sessions.\n\nYou can withdraw consent at any time by clearing your browser's local storage for this domain.`,
    },
    {
      heading: "7. Your Rights",
      body: `Under GDPR, you have the right to:\n\n• Access the personal data we hold about you (Art. 15)\n• Rectification of inaccurate data (Art. 16)\n• Erasure of your data ("right to be forgotten") (Art. 17)\n• Restriction of processing (Art. 18)\n• Data portability (Art. 20)\n• Object to processing (Art. 21)\n• Withdraw consent at any time without affecting the lawfulness of prior processing (Art. 7(3))\n\nTo exercise any of these rights, please contact: ${siteConfig.email}\n\nYou also have the right to lodge a complaint with your local supervisory authority. In Germany, this is the relevant Landesbeauftragter für den Datenschutz.`,
    },
    {
      heading: "8. Data Security",
      body: `This website is served over HTTPS. We take appropriate technical and organisational measures to protect your personal data against accidental or unlawful destruction, loss, alteration, or unauthorised disclosure.`,
    },
    {
      heading: "9. Changes to This Policy",
      body: `We may update this Privacy Policy from time to time. The "last updated" date at the top of this page reflects the most recent revision. We encourage you to review this page periodically.`,
    },
  ],
};

const de: typeof en = {
  back: "← Zurück zum Portfolio",
  title: "Datenschutzerklärung",
  updated: "Zuletzt aktualisiert: Februar 2026",
  sections: [
    {
      heading: "1. Verantwortlicher",
      body: `Verantwortlicher im Sinne der DSGVO ist:\n\nYaroslav Dolhushyn\nSangerhausen, Deutschland\nE-Mail: ${siteConfig.email}\nTelefon: ${siteConfig.phone}`,
    },
    {
      heading: "2. Kontaktformular",
      body: `Wenn Sie das Kontaktformular nutzen, erheben wir Ihren Namen, Ihre E-Mail-Adresse und Ihre Nachricht. Diese Daten werden direkt an die E-Mail-Adresse des Verantwortlichen übermittelt und ausschließlich zur Beantwortung Ihrer Anfrage verwendet.\n\nRechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahme auf Anfrage der betroffenen Person). Die Daten werden nur so lange aufbewahrt, wie es zur Bearbeitung Ihrer Anfrage erforderlich ist, und anschließend gelöscht.`,
    },
    {
      heading: "3. Webanalyse – Google Analytics 4",
      body: `Diese Website nutzt Google Analytics 4 (GA4), einen Webanalysedienst der Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland. GA4 erhebt anonymisierte Nutzungsdaten (besuchte Seiten, Sitzungsdauer, Gerätetyp, ungefährer Standort auf Basis der IP-Adresse), um zu verstehen, wie Besucher mit der Website interagieren.\n\nGA4 wird erst nach Ihrer ausdrücklichen Einwilligung über das Cookie-Banner geladen.\n\nRechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung). Sie können Ihre Einwilligung jederzeit widerrufen, indem Sie den Eintrag „cookie_consent" im Local Storage Ihres Browsers löschen.\n\nDaten können an Server von Google LLC in den USA unter Standardvertragsklauseln übermittelt werden. Weitere Informationen finden Sie in der Datenschutzerklärung von Google: https://policies.google.com/privacy?hl=de`,
    },
    {
      heading: "4. KI-Chat",
      body: `Das Portfolio enthält einen KI-gestützten Chat-Assistenten. Ihre Nachrichten werden zur Generierung einer Antwort an die OpenAI API (OpenAI, L.L.C., San Francisco, USA) übermittelt. Die Nachrichten werden in Echtzeit verarbeitet und nach der aktiven Browser-Sitzung nicht auf unseren Servern gespeichert.\n\nRechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem interaktiven Portfolio-Erlebnis). Die Daten werden nicht zum Training von KI-Modellen verwendet.\n\nWeitere Informationen finden Sie in der Datenschutzerklärung von OpenAI: https://openai.com/policies/privacy-policy`,
    },
    {
      heading: "5. Sprach-Chat",
      body: `Das Portfolio enthält eine optionale Sprach-Chat-Funktion. Bei deren Nutzung gilt:\n\n• Ihre Mikrofon-Aufnahme wird lokal im Browser erfasst und zur Sprachtranskription an Groq, Inc. (USA) übermittelt.\n• Der transkribierte Text wird zur Antwortgenerierung an die LLM-API von Groq gesendet.\n• Optional wird die Textantwort über ElevenLabs, Inc. (USA) in Sprache umgewandelt.\n\nAudioaufnahmen und Transkripte werden nicht auf unseren Servern gespeichert. Die Verarbeitung erfolgt nur zur Erzeugung der Antwort.\n\nRechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (die aktive Aktivierung des Mikrofons gilt als Einwilligung). Sie können die Sprachverarbeitung jederzeit durch Schließen des Sprach-Widgets beenden.\n\nWeitere Informationen:\n• Datenschutzerklärung Groq: https://groq.com/privacy-policy/\n• Datenschutzerklärung ElevenLabs: https://elevenlabs.io/privacy`,
    },
    {
      heading: "6. Cookies & Local Storage",
      body: `Diese Website nutzt den Local Storage des Browsers (keine Cookies) zur Speicherung Ihrer Einwilligungsentscheidung. Ohne Ihre Einwilligung werden keine Tracking-Cookies gesetzt. Bei Akzeptanz der Analyse-Cookies kann Google Analytics 4 eigene Cookies (__ga, __ga_*) in Ihrem Browser setzen.\n\nSie können Ihre Einwilligung jederzeit widerrufen, indem Sie den Local Storage dieser Domain in Ihrem Browser löschen.`,
    },
    {
      heading: "7. Ihre Rechte",
      body: `Gemäß DSGVO haben Sie folgende Rechte:\n\n• Auskunftsrecht (Art. 15 DSGVO)\n• Recht auf Berichtigung (Art. 16 DSGVO)\n• Recht auf Löschung (Art. 17 DSGVO)\n• Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)\n• Recht auf Datenübertragbarkeit (Art. 20 DSGVO)\n• Widerspruchsrecht (Art. 21 DSGVO)\n• Widerruf der Einwilligung (Art. 7 Abs. 3 DSGVO)\n\nZur Ausübung Ihrer Rechte wenden Sie sich bitte an: ${siteConfig.email}\n\nSie haben zudem das Recht, sich bei der zuständigen Datenschutzbehörde zu beschweren. In Deutschland ist dies der jeweils zuständige Landesbeauftragte für den Datenschutz.`,
    },
    {
      heading: "8. Datensicherheit",
      body: `Diese Website wird über HTTPS ausgeliefert. Wir treffen angemessene technische und organisatorische Maßnahmen, um Ihre personenbezogenen Daten vor unbeabsichtigter oder unrechtmäßiger Vernichtung, Verlust, Veränderung oder unbefugter Offenlegung zu schützen.`,
    },
    {
      heading: "9. Änderungen dieser Datenschutzerklärung",
      body: `Wir können diese Datenschutzerklärung von Zeit zu Zeit aktualisieren. Das Datum „Zuletzt aktualisiert" am Anfang dieser Seite gibt den Stand der letzten Überarbeitung an. Wir empfehlen, diese Seite regelmäßig zu überprüfen.`,
    },
  ],
};

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

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
