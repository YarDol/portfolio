import { openai } from "@ai-sdk/openai";
import {
  streamText,
  tool,
  zodSchema,
  stepCountIs,
  convertToModelMessages,
} from "ai";
import { z } from "zod";
import {
  portfolioSystemPrompt,
  getProfile,
  getSkills,
  getExperience,
  getProjects,
  getEducation,
  getContactInfo,
} from "@/entities/portfolio";
import { checkRateLimit, getClientIp } from "@/shared/lib/rate-limit";
import { siteConfig } from "@/shared/config";
import type { Locale } from "@/shared/i18n";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { allowed } = checkRateLimit(getClientIp(req));
  if (!allowed) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please try again later." }),
      { status: 429, headers: { "Content-Type": "application/json" } },
    );
  }

  const { messages, locale: rawLocale } = await req.json();
  const locale: Locale = rawLocale === "de" ? "de" : "en";

  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: portfolioSystemPrompt,
    messages: modelMessages,
    maxOutputTokens: 500,
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

  return result.toUIMessageStreamResponse();
}
