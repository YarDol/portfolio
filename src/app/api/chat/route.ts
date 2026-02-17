import { openai } from "@ai-sdk/openai";
import {
  streamText,
  tool,
  zodSchema,
  stepCountIs,
  convertToModelMessages,
} from "ai";
import { portfolioSystemPrompt } from "@/lib/portfolio-context";
import {
  getProfile,
  getSkills,
  getExperience,
  getProjects,
  getEducation,
  getContactInfo,
} from "@/lib/portfolio-rag";
import { z } from "zod";
import { siteConfig } from "@/lib/constants";

export const runtime = "edge";

const OFF_TOPIC_RESPONSE =
  "I can only provide information about Yaroslav Dolhushyn and his professional work.";

const YAROSLAV_KEYWORDS = [
  "yaroslav",
  "dolhushyn",
  "cv",
  "resume",
  "portfolio",
  "skill",
  "stack",
  "tech",
  "experience",
  "project",
  "work",
  "job",
  "hire",
  "developer",
  "engineer",
  "contact",
  "email",
  "phone",
  "linkedin",
  "github",
  "education",
  "certif",
  "aws",
  "react",
  "next",
  "node",
  "nest",
  "typescript",
  "mobile",
  "native",
  "who",
  "what",
  "tell",
  "about",
  "can you",
  "know",
  "hello",
  "hi",
  "hey",
  "hallo",
  "guten",
  "arbeit",
  "erfahrung",
  "fähigkeit",
  "projekt",
  "kontakt",
  "lebenslauf",
  "entwickler",
  "ausbildung",
  "download",
];

function isLikelyOffTopic(text: string): boolean {
  const lower = text.toLowerCase();
  if (lower.length < 4) return false;
  return !YAROSLAV_KEYWORDS.some((kw) => lower.includes(kw));
}

type Locale = "en" | "de";

export async function POST(req: Request) {
  const { messages, locale: rawLocale } = await req.json();
  const locale: Locale = rawLocale === "de" ? "de" : "en";

  const lastUserMsg = [...messages]
    .reverse()
    .find((m: { role: string }) => m.role === "user");

  if (lastUserMsg) {
    const parts: { type: string; text?: string }[] =
      lastUserMsg.parts ?? lastUserMsg.content ?? [];
    const text = Array.isArray(parts)
      ? parts
          .filter((p) => p.type === "text" && p.text)
          .map((p) => p.text)
          .join(" ")
      : typeof parts === "string"
        ? parts
        : "";

    if (text && isLikelyOffTopic(text)) {
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode(OFF_TOPIC_RESPONSE));
          controller.close();
        },
      });
      return new Response(stream, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }
  }

  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: portfolioSystemPrompt,
    messages: modelMessages,
    stopWhen: stepCountIs(5),

    tools: {
      getProfile: tool({
        description:
          "Get Yaroslav's profile summary: name, role, location, work authorization, highlights, bio, languages, and key traits. Call this for general 'who is he' or introductory questions.",
        inputSchema: zodSchema(z.object({})),
        execute: async () => getProfile(locale),
      }),

      getSkills: tool({
        description:
          "Get Yaroslav's complete tech stack organized by category (frontend, backend, mobile, devops, tools, analytics). Call this for any skills/technology questions.",
        inputSchema: zodSchema(z.object({})),
        execute: async () => getSkills(locale),
      }),

      getExperience: tool({
        description:
          "Get Yaroslav's work experience: current role, company, achievements, and certifications. Call this for career/experience/job history questions.",
        inputSchema: zodSchema(z.object({})),
        execute: async () => getExperience(locale),
      }),

      getProjects: tool({
        description:
          "Get all of Yaroslav's commercial projects with titles, descriptions, and roles. Call this for project-related questions.",
        inputSchema: zodSchema(z.object({})),
        execute: async () => getProjects(locale),
      }),

      getEducation: tool({
        description:
          "Get Yaroslav's education (degrees, universities, periods) and certifications. Call this for education/qualification questions.",
        inputSchema: zodSchema(z.object({})),
        execute: async () => getEducation(locale),
      }),

      getContact: tool({
        description:
          "Get Yaroslav's contact info: email, phone, location, availability, GitHub, LinkedIn. Call this for contact/reach-out questions.",
        inputSchema: zodSchema(z.object({})),
        execute: async () => getContactInfo(locale),
      }),

      downloadCV: tool({
        description:
          "Get the direct URL to download Yaroslav's CV/resume as PDF. Call this when the user wants to download or view the CV.",
        inputSchema: zodSchema(z.object({})),
        execute: async () => ({
          url: siteConfig.cvUrl,
        }),
      }),
    },
  });

  return result.toTextStreamResponse();
}
