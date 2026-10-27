import { createHmac, randomUUID } from "node:crypto";

// One atomic reservation across all serverless instances. Failed provider calls
// also consume a slot. No transcript or raw IP is stored in Redis.
export const RESERVE_SCRIPT = `
if tonumber(redis.call('GET', KEYS[1]) or '0') >= 100 then return -1 end
if tonumber(redis.call('GET', KEYS[2]) or '0') >= 10 then return -2 end
if redis.call('EXISTS', KEYS[3]) == 1 then return -3 end
redis.call('INCR', KEYS[1])
local count = redis.call('INCR', KEYS[2])
if count == 1 then redis.call('EXPIRE', KEYS[2], 86400) end
redis.call('SET', KEYS[3], ARGV[1], 'EX', ARGV[2])
return 10 - count
`;

export function demoConfigured() {
  return process.env.DEMO_ENABLED === "true" && !!process.env.OPENAI_API_KEY &&
    !!(process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL) &&
    !!(process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN) &&
    (process.env.DEMO_LIMIT_SECRET?.length ?? 0) >= 32;
}

async function redis(command: (string | number)[]) {
  const url = (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL)!;
  if (!url.startsWith("https://")) throw new Error("Invalid limiter configuration");
  const response = await fetch(url, {
    method: "POST", headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(command), cache: "no-store", signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error("Limiter unavailable");
  const result = await response.json();
  if (result.error) throw new Error("Limiter unavailable");
  return result.result;
}

export async function reserveDemo(request: Request, lockSeconds = 40) {
  // Vercel controls this header. Never use client-supplied x-forwarded-for.
  const ip = process.env.VERCEL ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() : "local-test";
  if (!ip) throw new Error("Missing trusted client identity");
  const hash = createHmac("sha256", process.env.DEMO_LIMIT_SECRET!).update(ip).digest("hex");
  const scope = process.env.VERCEL_ENV === "production" ? "production" : "preview";
  const prefix = `nokturn:demo:v1:${scope}`;
  const lock = `${prefix}:busy:${hash}`;
  const token = randomUUID();
  const remaining = Number(await redis(["EVAL", RESERVE_SCRIPT, 3, `${prefix}:total`, `${prefix}:visitor:${hash}`, lock, token, lockSeconds]));
  if (!Number.isInteger(remaining)) throw new Error("Invalid limiter response");
  return { remaining, release: async () => { await redis(["EVAL", "if redis.call('GET', KEYS[1]) == ARGV[1] then return redis.call('DEL', KEYS[1]) else return 0 end", 1, lock, token]); } };
}
