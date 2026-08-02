import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";
import { z } from "zod";

import { getSquare } from "@/lib/square";

const MIN_AMOUNT_CENTS = 100; // $1
const MAX_AMOUNT_CENTS = 1_000_000; // $10,000

const checkoutSchema = z.object({
  amountCents: z
    .number()
    .int()
    .min(MIN_AMOUNT_CENTS, "Enter at least $1.")
    .max(MAX_AMOUNT_CENTS, "Enter $10,000 or less."),
});

export async function POST(request: Request) {
  if (!process.env.SQUARE_ACCESS_TOKEN || !process.env.SQUARE_LOCATION_ID) {
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

  const { amountCents } = parsed.data;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  try {
    const { paymentLink } = await getSquare().checkout.paymentLinks.create({
      idempotencyKey: randomUUID(),
      quickPay: {
        name: "Donation to Columbus Indian Community Events",
        priceMoney: {
          amount: BigInt(amountCents),
          currency: "USD",
        },
        locationId: process.env.SQUARE_LOCATION_ID,
      },
      checkoutOptions: {
        redirectUrl: `${siteUrl}/donate/thanks`,
      },
    });

    if (!paymentLink?.url) {
      return NextResponse.json(
        { error: "Could not start checkout. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ url: paymentLink.url });
  } catch {
    return NextResponse.json(
      { error: "Could not start checkout. Please try again." },
      { status: 502 },
    );
  }
}
