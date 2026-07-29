import { NextResponse } from "next/server";
import { z } from "zod";

import { getStripe } from "@/lib/stripe";

const MIN_AMOUNT_CENTS = 100; // $1
const MAX_AMOUNT_CENTS = 1_000_000; // $10,000

const checkoutSchema = z.object({
  amountCents: z
    .number()
    .int()
    .min(MIN_AMOUNT_CENTS, "Enter at least $1.")
    .max(MAX_AMOUNT_CENTS, "Enter $10,000 or less."),
  interval: z.enum(["once", "monthly"]),
});

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Donations aren't set up yet." },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Enter a valid amount." },
      { status: 400 },
    );
  }

  const { amountCents, interval } = parsed.data;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: interval === "monthly" ? "subscription" : "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: amountCents,
            product_data: {
              name: "Donation to Columbus Community Events",
            },
            ...(interval === "monthly"
              ? { recurring: { interval: "month" as const } }
              : {}),
          },
        },
      ],
      success_url: `${siteUrl}/donate/thanks?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/#donate`,
    });

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json(
      { error: "Could not start checkout. Please try again." },
      { status: 502 },
    );
  }
}
