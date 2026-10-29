import WebSocket from "ws";
import { agentInstructions, type DemoIndustry } from "./demo-agent";
import { pauseRealtime, callClosed, markCallClosed } from "./realtime-limits";

export const REALTIME_MODEL = "gpt-realtime-2.1-mini";
export function realtimeSession(industry: DemoIndustry) {
  return {
    type: "realtime", model: REALTIME_MODEL, output_modalities: ["audio"],
    instructions: `${agentInstructions(industry)}\nGŁOS: Rozmawiasz na żywo przez mikrofon. Mów ciepło, wyraźnie, po polsku, bez pośpiechu. Odpowiadaj zwykle jednym lub dwoma krótkimi zdaniami. Gdy nie słyszysz wyraźnie, poproś o powtórzenie zamiast zgadywać. Przywitaj się krótko imieniem i nazwą fikcyjnej firmy, zaznacz że jesteś AI w demo, zapytaj w czym pomóc. Gdy użytkownik Ci przerwie, słuchaj jego nowego pytania. Nie odczytuj znaków formatowania.`,
    max_output_tokens: 500, tools: [], tool_choice: "none", tracing: null,
    audio: {
      input: { noise_reduction: { type: "near_field" }, transcription: { model: "gpt-transcribe", languages: ["pl"] }, turn_detection: { type: "server_vad", threshold: 0.5, prefix_padding_ms: 300, silence_duration_ms: 650, create_response: true, interrupt_response: true } },
      output: { voice: "marin" },
    },
    truncation: { type: "retention_ratio", retention_ratio: 0.8, token_limits: { post_instructions: 4000 } },
  };
}
export async function hangupCall(callId: string) {
  if (!/^rtc_[a-zA-Z0-9_-]+$/.test(callId)) throw Error("Invalid call");
  if (await callClosed(callId).catch(() => false)) return;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const r = await fetch(`https://api.openai.com/v1/realtime/calls/${callId}/hangup`, {
        method: "POST", headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }, signal: AbortSignal.timeout(4000),
      });
      if (r.ok || r.status === 404 || r.status === 410) {
        await markCallClosed(callId).catch(() => {});
        return;
      }
    } catch { /* Retry closing; never retry creating a paid call. */ }
  }
  if (await callClosed(callId).catch(() => false)) return;
  await pauseRealtime().catch(() => {});
  console.error("realtime_hangup_unconfirmed"); // Never log audio, SDP, tokens or transcripts.
  throw Error("Hangup unconfirmed");
}

/** Attach BEFORE returning the SDP answer. The server owns the timeout even if
 * a client removes its countdown. Next after() keeps this watchdog alive. */
export function watchRealtime(callId: string, expiresAt: number) {
  const ws = new WebSocket(`wss://api.openai.com/v1/realtime?call_id=${callId}`, {
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }, handshakeTimeout: 8000, maxPayload: 1024 * 1024,
  });
  let closing = false, settled = false, responses = 0, totalTokens = 0;
  let readyResolve!: () => void, readyReject!: (e: Error) => void, doneResolve!: () => void;
  const ready = new Promise<void>((resolve, reject) => { readyResolve = resolve; readyReject = reject; });
  const done = new Promise<void>(resolve => { doneResolve = resolve; });
  const startupTimer = setTimeout(() => { void stop("startup_timeout"); }, 9000);
  const deadlineTimer = setTimeout(() => { void stop("time_limit"); }, Math.max(0, expiresAt - Date.now()));
  async function stop(reason: string) {
    if (closing) return done;
    closing = true;
    clearTimeout(startupTimer); clearTimeout(deadlineTimer);
    if (!settled) { settled = true; readyReject(Error("Voice control unavailable")); }
    try { await hangupCall(callId); }
    catch { /* hangupCall paused new sessions; watchdog still cleans its socket. */ }
    finally { ws.terminate(); console.info("realtime_closed", { reason, responses, totalTokens }); doneResolve(); }
  }
  // The SDP answer has not reached the browser yet. Waiting for a session
  // event here can deadlock negotiation; the authenticated socket handshake
  // is enough to arm the watchdog before the media peer connects.
  ws.on("open", () => {
    if (!settled && !closing) { settled = true; clearTimeout(startupTimer); readyResolve(); }
  });
  ws.on("message", raw => {
    try {
      const event = JSON.parse(raw.toString());
      if (event.type === "session.created" && !settled && !closing) {
        settled = true; clearTimeout(startupTimer); readyResolve();
      } else if (event.type === "session.updated") {
        // The client UI never updates the session; fail closed on tampering.
        void stop("configuration_changed");
      } else if (event.type === "response.created") {
        responses++;
        if (responses > 12) void stop("turn_limit");
      } else if (event.type === "response.done") {
        const count = event.response?.usage?.total_tokens;
        if (typeof count === "number" && Number.isFinite(count) && count >= 0) totalTokens += count;
        else { void stop("usage_unavailable"); return; }
        if (totalTokens >= 12000) void stop("usage_limit");
      } else if (event.type === "error") { void stop("provider_error"); }
    } catch { void stop("invalid_event"); }
  });
  ws.on("error", () => { void stop("control_error"); });
  ws.on("close", () => { void stop("control_closed"); });
  return { ready, done, stop };
}
