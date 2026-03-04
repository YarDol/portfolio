# yaroslavdolhushyn.dev

Personal portfolio of **Yaroslav Dolhushyn** — Full-Stack Engineer based in Germany. Built with Next.js 16, Three.js, and Framer Motion.

[![Live](https://img.shields.io/badge/live-yaroslavdolhushyn.dev-6366f1?style=flat-square)](https://yaroslavdolhushyn.dev)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-v4-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion v12 |
| 3D / WebGL | Three.js |
| i18n | next-intl (EN / DE) |
| AI Chat | Vercel AI SDK + GPT-4o-mini |
| Voice | Groq / Llama (streaming TTS) |
| Analytics | Google Analytics 4 + Microsoft Clarity |
| Email | Resend |
| Deployment | Vercel |

---

## Features

- **Dark / Light theme** — system-aware with smooth transitions
- **English / German** — full i18n with next-intl
- **Three.js scenes** — orbital experience viewer, particle contact bg, project canvases
- **3D card tilt** — spring-physics tilt on project cards (Framer Motion)
- **AI portfolio chat** — GPT-4o-mini with tool-calling RAG over portfolio data
- **Voice assistant** — Groq-powered streaming voice Q&A
- **Contact form** — Resend email delivery with GDPR consent
- **Cookie consent** — GDPR-compliant banner, analytics gated behind consent
- **Analytics disabled in dev** — GA4 + Clarity only fire in production

---

## Project Structure

```
src/
├── app/
│   ├── [locale]/          # i18n routes (en, de)
│   ├── actions/           # Server actions (contact form)
│   └── api/
│       ├── chat/          # AI chat endpoint (GPT-4o-mini)
│       └── voice/         # Voice endpoint (Groq)
├── components/
│   ├── layout/            # Header, Footer, CookieBanner
│   ├── sections/          # Hero, About, Experience, Projects, Skills, Contact
│   │   ├── contact/       # ContactBg canvas, form sub-components
│   │   ├── experience/    # Orbital Three.js scene, metrics, education
│   │   └── projects/      # Project cards with 3D tilt + SVG patterns
│   └── ui/                # Shared: SectionHeading, ScrollReveal, etc.
├── lib/
│   ├── portfolio-context.ts   # AI chat system prompt
│   ├── portfolio-index.ts     # Voice assistant prompt + static snapshot
│   ├── portfolio-rag.ts       # Dynamic RAG functions (reads from i18n)
│   ├── projects.ts            # Project definitions
│   ├── skills.ts              # Skill categories
│   └── constants.ts           # siteConfig
└── messages/
    ├── en.json            # English content
    └── de.json            # German content
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Copy env file and fill in keys
cp .env.example .env.local

# Start dev server (analytics disabled automatically)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

```env
# AI Chat
OPENAI_API_KEY=

# Voice
GROQ_API_KEY=

# Email (contact form)
RESEND_API_KEY=
CONTACT_EMAIL=

# Analytics (only active in production)
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_CLARITY_ID=
```

---

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

---

## License

Personal portfolio — code is open for reference, not for reuse as-is.
