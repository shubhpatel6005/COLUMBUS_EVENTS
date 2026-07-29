// Fails open (treats the request as verified) when Turnstile isn't
// configured yet — see CLAUDE.md "External service setup still needed".
export async function verifyTurnstile(
  token: string | undefined,
  remoteIp: string,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret, response: token, remoteip: remoteIp }),
      },
    );
    const data = await res.json();
    return data.success === true;
  } catch {
    return false;
  }
}
