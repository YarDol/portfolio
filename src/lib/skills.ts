export const skillCategories = [
  {
    key: "ai" as const,
    count: 4,
    skills: [
      "Streaming LLM integrations (OpenAI, Groq...)",
      "Voice AI (STT/TTS, ElevenLabs)",
      "RAG pipelines",
      "Prompt engineering & context design",
    ],
  },
  {
    key: "frontend" as const,
    count: 9,
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "TanStack Query", "Zustand", "Three.js", "WebSockets", "SEO"],
  },
  {
    key: "backend" as const,
    count: 9,
    skills: ["Node.js", "Nest.js", "PostgreSQL", "Redis", "MongoDB", "Kafka", "GraphQL", "Microservices", "Stripe"],
  },
  {
    key: "mobile" as const,
    count: 6,
    skills: ["React Native", "Expo", "Deep Linking", "Push Notifications", "In-App Purchases", "Ionic"],
  },
  {
    key: "platform" as const,
    count: 11,
    skills: ["AWS (S3, Lambda, RDS)", "Docker", "GitHub Actions", "Cloudflare", "Nginx", "Sentry", "GA4", "Amplitude", "Playwright", "Jest", "Meta ADs"],
  },
] as const;

export type CategoryKey = (typeof skillCategories)[number]["key"];
