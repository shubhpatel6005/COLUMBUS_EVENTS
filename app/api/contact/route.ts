import { NextResponse } from "next/server";

import { getResend } from "@/lib/email";
import { checkContactRateLimit } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";
import { contactSchema } from "@/lib/validation";

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || "unknown";
}

const subjectLabels: Record<string, string> = {
  general: "General",
  sponsorship: "Sponsorship",
  volunteer: "Volunteer",
  press: "Press",
};

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json(
      {
        error: issue?.message ?? "Check your entries and try again.",
        field: issue?.path[0],
      },
      { status: 400 },
    );
  }

  const { name, email, subject, message, honeypot, turnstileToken } =
    parsed.data;

  // Bots that fill every field get a fake success so they don't learn
  // the honeypot exists.
  if (honeypot) {
    return NextResponse.json({ success: true });
  }

  const ip = getClientIp(request);

  const { allowed } = await checkContactRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many messages sent. Please try again in an hour." },
      { status: 429 },
    );
  }

  const verified = await verifyTurnstile(turnstileToken, ip);
  if (!verified) {
    return NextResponse.json(
      { error: "Verification failed. Please try again." },
      { status: 400 },
    );
  }

  if (
    !process.env.RESEND_API_KEY ||
    !process.env.CONTACT_TO_EMAIL ||
    !process.env.CONTACT_FROM_EMAIL
  ) {
    return NextResponse.json(
      { error: "The contact form isn't set up yet." },
      { status: 503 },
    );
  }

  try {
    await getResend().emails.send({
      from: process.env.CONTACT_FROM_EMAIL,
      to: process.env.CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `[${subjectLabels[subject]}] Message from ${name}`,
      text: `From: ${name} <${email}>\nSubject: ${subjectLabels[subject]}\n\n${message}`,
    });
  } catch {
    return NextResponse.json(
      { error: "Could not send your message right now. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ success: true });
}
