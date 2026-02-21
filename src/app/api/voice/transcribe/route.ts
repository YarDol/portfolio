import { checkRateLimit } from "@/lib/rate-limit";

export const maxDuration = 30;

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const { allowed } = checkRateLimit(ip);
  if (!allowed) {
    return Response.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "GROQ_API_KEY not configured" }, { status: 500 });
  }

  const formData = await req.formData();
  const audio = formData.get("audio") as File | null;

  if (!audio) {
    return Response.json({ error: "No audio provided" }, { status: 400 });
  }

  const groqForm = new FormData();
  groqForm.append("file", audio, "audio.webm");
  groqForm.append("model", "whisper-large-v3");
  groqForm.append("response_format", "json");

  const res = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: groqForm,
  });

  if (!res.ok) {
    const err = await res.text();
    return Response.json({ error: err }, { status: 500 });
  }

  const data = await res.json();
  return Response.json({ text: data.text ?? "" });
}
