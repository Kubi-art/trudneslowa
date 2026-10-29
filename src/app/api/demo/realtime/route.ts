import { after, connection } from "next/server";
import { demoBusinesses, type DemoIndustry } from "@/lib/demo-agent";
import { hangupCall, realtimeSession, watchRealtime } from "@/lib/realtime-agent";
import { pauseRealtime, REALTIME_SECONDS, realtimeConfigured, reserveRealtime, signCall, verifyCall } from "@/lib/realtime-limits";

export const maxDuration = 180;
const headers = { "Cache-Control": "no-store" };
const failure = (error: string, status: number) => Response.json({ error }, { status, headers });
async function readJson(request: Request) {
  if (!request.body) throw Error("Empty body");
  const reader = request.body.getReader(), chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read(); if (done) break;
      size += value.byteLength;
      if (size > 24000) { await reader.cancel(); throw Error("Body too large"); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}
export async function GET() {
  await connection();
  return Response.json({ available: realtimeConfigured(), maxSeconds: REALTIME_SECONDS }, { headers });
}
export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) return failure("Otwórz demo na stronie NOKTURN.", 403);
  if (!request.headers.get("content-type")?.startsWith("application/json")) return failure("Nieprawidłowy format.", 415);
  let body;
  try { body = await readJson(request); if (!body || typeof body !== "object") throw Error(); }
  catch { return failure("Nieprawidłowe dane połączenia.", 400); }
  // Stop remains available after the launch flag is turned off.
  if (body.action === "stop") {
    const callId = verifyCall(body.token);
    if (!callId) return failure("Nieprawidłowe zakończenie sesji.", 403);
    try { await hangupCall(callId); return Response.json({ stopped: true }, { headers }); }
    catch { return failure("Zamknij kartę, aby przerwać dźwięk. Serwer nie potwierdził zakończenia sesji.", 502); }
  }
  if (!realtimeConfigured()) return failure("Rozmowa na żywo jest chwilowo niedostępna. Skorzystaj z czatu.", 503);
  if (body.action !== "start" || body.consent !== true || typeof body.industry !== "string" || !Object.hasOwn(demoBusinesses, body.industry) || typeof body.sdp !== "string" || body.sdp.length > 20000 || !body.sdp.startsWith("v=0") || !body.sdp.includes("m=audio") || body.sdp.includes("m=video")) return failure("Nieprawidłowe dane połączenia lub brak potwierdzenia zasad demo.", 400);
  let reserved;
  try { reserved = await reserveRealtime(request); }
  catch { return failure("Demo jest chwilowo niedostępne. Spróbuj później.", 503); }
  if (reserved !== 0) return failure(reserved === -2 ? "Wykorzystano próbę głosową z tej sieci. Kolejna będzie dostępna po 24 godzinach. Możesz skorzystać z czatu." : "Pula rozmów głosowych jest chwilowo niedostępna. Możesz skorzystać z czatu.", 429);
  let callId: string | undefined;
  try {
    const form = new FormData();
    form.set("sdp", body.sdp);
    form.set("session", JSON.stringify(realtimeSession(body.industry as DemoIndustry)));
    const upstream = await fetch("https://api.openai.com/v1/realtime/calls", {
      method: "POST", headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }, body: form, signal: AbortSignal.timeout(15000),
    });
    if (!upstream.ok) { console.warn("realtime_create_failed", { status: upstream.status }); return failure("Nie udało się połączyć z Mają. Skorzystaj z czatu lub spróbuj później.", 502); }
    const location = upstream.headers.get("location");
    const match = location?.match(/\/realtime\/calls\/(rtc_[a-zA-Z0-9_-]+)$/);
    if (!match) { await pauseRealtime(); throw Error("No call identity"); }
    callId = match[1];
    const sdp = await upstream.text();
    if (!sdp.startsWith("v=0") || sdp.length > 40000) throw Error("Invalid answer");
    const expiresAt = Date.now() + REALTIME_SECONDS * 1000;
    const watchdog = watchRealtime(callId, expiresAt);
    after(() => watchdog.done);
    await watchdog.ready;
    if (request.signal.aborted) { await watchdog.stop("client_cancelled"); return failure("Połączenie anulowane.", 499); }
    return Response.json({ sdp, expiresAt, stopToken: signCall(callId, expiresAt + 60000) }, { headers });
  } catch {
    if (callId) await hangupCall(callId).catch(() => {});
    else await pauseRealtime().catch(() => {}); // An uncertain create must not trigger automatic retries.
    return failure("Nie udało się uruchomić rozmowy. Mikrofon zostanie wyłączony. Możesz skorzystać z czatu.", 502);
  }
}
