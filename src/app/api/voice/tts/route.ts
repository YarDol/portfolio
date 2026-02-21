import { checkRateLimit } from "@/lib/rate-limit";

export const maxDuration = 30;

const DEFAULT_VOICE_ID =
  process.env.ELEVENLABS_VOICE_ID ?? "21m00Tcm4TlvDq8ikWAM";

export async function POST(req: Request) {
  if (process.env.VOICE_ELEVENLABS_DISABLED === "true") {
    return new Response("ElevenLabs TTS is disabled", { status: 503 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const { allowed } = checkRateLimit(ip);
  if (!allowed) {
    return new Response("Too many requests.", { status: 429 });
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return new Response("ELEVENLABS_API_KEY not configured", { status: 500 });
  }

  const { text } = await req.json();
  if (!text?.trim()) {
    return new Response("No text provided", { status: 400 });
  }

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${DEFAULT_VOICE_ID}/stream`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_turbo_v2_5",
        voice_settings: { stability: 0.5, similarity_boost: 0.8 },
        output_format: "mp3_44100_128",
      }),
    },
  );

  if (!res.ok) {
    const err = await res.text();
    console.error("ElevenLabs TTS error:", err);
    return new Response("TTS failed", { status: 502 });
  }

  return new Response(res.body, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-cache",
    },
  });
}
