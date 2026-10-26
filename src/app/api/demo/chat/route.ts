import { connection } from "next/server";
import { agentInstructions, parseDemoRequest } from "@/lib/demo-agent";
import { demoConfigured, reserveDemo } from "@/lib/demo-limits";


export const maxDuration = 45;
const headers = { "Cache-Control": "no-store" };
const failure = (message: string, status: number) => Response.json({ error: message }, { status, headers });

export async function GET() {
  await connection();
  return Response.json({ available: demoConfigured(), maxTurns: 10 }, { headers });
}

async function readBody(request: Request) {
  if (!request.body) throw new Error("Brak wiadomości.");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 32000) { await reader.cancel(); throw new Error("Wiadomość jest za długa."); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) return failure("Otwórz demo na stronie NOKTURN.", 403);
  if (!request.headers.get("content-type")?.startsWith("application/json")) return failure("Nieprawidłowy format.", 415);
  if (!demoConfigured()) return failure("Demo AI nie zostało jeszcze włączone. Możesz obejrzeć przygotowaną prezentację poniżej.", 503);
  let input;
  try { input = parseDemoRequest(await readBody(request)); }
  catch { return failure("Sprawdź wiadomość i długość rozmowy. Maksymalnie 700 znaków na wiadomość i 10 pytań.", 400); }
  let reservation: Awaited<ReturnType<typeof reserveDemo>>;
  try { reservation = await reserveDemo(request); }
  catch { return failure("Demo jest chwilowo niedostępne. Spróbuj później.", 503); }
  if (reservation.remaining < 0) return failure(reservation.remaining === -1 ? "Pula prób demo została wykorzystana. Zajrzyj ponownie po jej odnowieniu." : reservation.remaining === -2 ? "Wykorzystano 10 prób z tej sieci w ciągu 24 godzin." : "Jedna odpowiedź jest już przygotowywana. Poczekaj chwilę.", 429);
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST", headers: { "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "gpt-5-mini", instructions: agentInstructions(input.industry), input: input.messages, max_output_tokens: 800, reasoning: { effort: "low" }, store: false }),
      signal: AbortSignal.timeout(30000), cache: "no-store",
    });
    if (!response.ok) return failure("Asystentka nie może teraz odpowiedzieć. Spróbuj później.", 502);
    const data = await response.json();
    const text = (data.output ?? []).filter((item: { type: string }) => item.type === "message")
      .flatMap((item: { content?: { type: string; text?: string }[] }) => item.content ?? [])
      .filter((item: { type: string }) => item.type === "output_text")
      .map((item: { text: string }) => item.text).join("\n");
    if (!text || data.status !== "completed" || text.length > 2400) return failure("Nie udało się przygotować pełnej odpowiedzi. Spróbuj krótszego pytania.", 502);
    return Response.json({ text, remaining: reservation.remaining }, { headers });
  } catch { return failure("Odpowiedź trwała zbyt długo. Spróbuj ponownie za chwilę.", 504); }
  finally { await reservation.release().catch(() => {}); }
}
