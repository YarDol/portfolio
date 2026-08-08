import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { voiceSystemPrompt } from "@/entities/portfolio";
import { checkRateLimit, getClientIp } from "@/shared/lib/rate-limit";

export const maxDuration = 30;

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  if (process.env.VOICE_CHAT_DISABLED === "true") {
    return Response.json({ error: "disabled" }, { status: 503 });
  }

  const { allowed } = checkRateLimit(getClientIp(req));
  if (!allowed) {
    return Response.json({ error: "rate_limit" }, { status: 429 });
  }

  const { messages } = await req.json();

  try {
    const { text } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      system: voiceSystemPrompt,
      messages,
      maxOutputTokens: 150,
    });

    return Response.json({ text: text ?? "" });
  } catch (error: unknown) {
    const statusCode = (error as { statusCode?: number })?.statusCode;
    if (statusCode === 429) {
      return Response.json({ error: "quota_exceeded" }, { status: 429 });
    }
    console.error("Voice chat error:", error);
    return Response.json({ error: "service_error" }, { status: 500 });
  }
}
