import { createGroq } from "@ai-sdk/groq";
import { streamText } from "ai";
import { voiceSystemPrompt } from "@/lib/portfolio-index";
import { checkRateLimit } from "@/lib/rate-limit";

export const maxDuration = 30;

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const { allowed } = checkRateLimit(ip);
  if (!allowed) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please try again later." }),
      { status: 429, headers: { "Content-Type": "application/json" } },
    );
  }

  const { messages } = await req.json();

  const result = streamText({
    model: groq("llama-3.3-70b-versatile"),
    system: voiceSystemPrompt,
    messages,
    maxOutputTokens: 150,
  });

  return result.toTextStreamResponse();
}
