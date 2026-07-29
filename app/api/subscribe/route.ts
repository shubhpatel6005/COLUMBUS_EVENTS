import { NextResponse } from "next/server";
import { z } from "zod";

import { getResend } from "@/lib/email";

const subscribeSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
});

export async function POST(request: Request) {
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!process.env.RESEND_API_KEY || !audienceId) {
    return NextResponse.json(
      { error: "Newsletter signup isn't set up yet." },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = subscribeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: parsed.error.issues[0]?.message ?? "Enter a valid email address.",
      },
      { status: 400 },
    );
  }

  try {
    await getResend().contacts.create({
      email: parsed.data.email,
      audienceId,
    });
  } catch {
    return NextResponse.json(
      { error: "Could not sign you up right now. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ success: true });
}
