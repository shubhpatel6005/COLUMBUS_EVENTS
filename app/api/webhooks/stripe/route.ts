import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { getResend } from "@/lib/email";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  const body = await request.text();

  let event: Stripe.Event;
  try {
    if (!signature) throw new Error("Missing stripe-signature header");
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const donorEmail = session.customer_details?.email ?? "unknown donor";
    const amount = session.amount_total
      ? (session.amount_total / 100).toFixed(2)
      : "unknown amount";

    if (
      process.env.RESEND_API_KEY &&
      process.env.CONTACT_TO_EMAIL &&
      process.env.CONTACT_FROM_EMAIL
    ) {
      await getResend()
        .emails.send({
          from: process.env.CONTACT_FROM_EMAIL,
          to: process.env.CONTACT_TO_EMAIL,
          subject: "New donation received",
          text: `A new donation of $${amount} was received from ${donorEmail}.`,
        })
        .catch(() => {
          // Email delivery failing shouldn't make Stripe retry the webhook.
        });
    }
  }

  return NextResponse.json({ received: true });
}
