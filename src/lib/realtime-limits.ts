import { createHmac, timingSafeEqual } from "node:crypto";
import { demoConfigured, redis } from "./demo-limits";

export const REALTIME_SECONDS = 120;
export const REALTIME_POOL = 10;
const prefix = () => `nokturn:realtime:v1:${process.env.VERCEL_ENV === "production" ? "production" : "preview"}`;
export const REALTIME_RESERVE_SCRIPT = `
-- Preview-only operator recovery nonce. Never renew any usage counters.
if ARGV[1] ~= '' and redis.call('GET', KEYS[4]) ~= ARGV[1] then
  redis.call('SET', KEYS[4], ARGV[1])
  redis.call('DEL', KEYS[3])
end
if redis.call('EXISTS', KEYS[3]) == 1 then return -3 end
if tonumber(redis.call('GET', KEYS[1]) or '0') >= 10 then return -1 end
if redis.call('EXISTS', KEYS[2]) == 1 then return -2 end
redis.call('INCR', KEYS[1])
redis.call('SET', KEYS[2], '1', 'EX', 86400)
return 0
`;
export function realtimeConfigured() {
  return demoConfigured() && process.env.REALTIME_DEMO_ENABLED === "true";
}
export async function reserveRealtime(request: Request) {
  const ip = process.env.VERCEL ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() : "local-test";
  if (!ip) throw Error("Missing trusted identity");
  const hash = createHmac("sha256", process.env.DEMO_LIMIT_SECRET!).update(ip).digest("hex");
  const p = prefix();
  const recovery = process.env.VERCEL_ENV === "preview" && /^[a-zA-Z0-9_-]{1,80}$/.test(process.env.REALTIME_RECOVERY_ID ?? "") ? process.env.REALTIME_RECOVERY_ID! : "";
  const result = Number(await redis(["EVAL", REALTIME_RESERVE_SCRIPT, 4, `${p}:total`, `${p}:visitor:${hash}`, `${p}:paused`, `${p}:recovery`, recovery]));
  if (![0, -1, -2, -3].includes(result)) throw Error("Invalid reservation");
  return result;
}
// Fail closed for future sessions if the provider cannot confirm a hangup.
export async function pauseRealtime() { await redis(["SET", `${prefix()}:paused`, "1"]); }

// Shared confirmation makes browser-stop and watchdog-stop idempotent across workers.
export async function callClosed(callId: string) { return await redis(["GET", `${prefix()}:closed:${callId}`]) === "1"; }
export async function markCallClosed(callId: string) { await redis(["SET", `${prefix()}:closed:${callId}`, "1", "EX", 600]); }

export function signCall(callId: string, expiresAt: number) {
  const payload = `${callId}.${expiresAt}`;
  return `${payload}.${createHmac("sha256", process.env.DEMO_LIMIT_SECRET!).update(`realtime-stop:${payload}`).digest("hex")}`;
}
export function verifyCall(token: unknown): string | null {
  if (typeof token !== "string" || token.length > 300) return null;
  const [callId, expiry, signature, extra] = token.split(".");
  if (extra || !/^rtc_[a-zA-Z0-9_-]+$/.test(callId) || !/^\d{13}$/.test(expiry) || !/^[a-f0-9]{64}$/.test(signature ?? "")) return null;
  const deadline = Number(expiry);
  if (deadline < Date.now() || deadline > Date.now() + 10 * 60_000) return null;
  const expected = signCall(callId, deadline).split(".")[2];
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected)) ? callId : null;
}
