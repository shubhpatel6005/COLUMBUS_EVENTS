import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let limiter: Ratelimit | null = null;

function getLimiter(): Ratelimit | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  if (!limiter) {
    limiter = new Ratelimit({
      redis: new Redis({ url, token }),
      limiter: Ratelimit.slidingWindow(5, "1 h"),
      prefix: "contact-form",
    });
  }
  return limiter;
}

// Fails open (allows the request) when Upstash isn't configured yet — see
// CLAUDE.md "External service setup still needed". A contact form that's
// silently unlimited is a smaller problem than one that's silently down.
export async function checkContactRateLimit(
  ip: string,
): Promise<{ allowed: boolean }> {
  const rl = getLimiter();
  if (!rl) return { allowed: true };

  const { success } = await rl.limit(ip);
  return { allowed: success };
}
