import { NextResponse } from "next/server";
import { WebhooksHelper } from "square";

import { getResend } from "@/lib/email";

export async function POST(request: Request) {
  const signatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
  if (!signatureKey) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const signature = request.headers.get("x-square-hmacsha256-signature");
  const body = await request.text();

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const valid = await WebhooksHelper.verifySignature({
    requestBody: body,
    signatureHeader: signature,
    signatureKey,
    notificationUrl: `${siteUrl}/api/webhooks/square`,
  });

  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);

  if (event.type === "payment.updated") {
    const payment = event.data?.object?.payment;

    if (payment?.status === "COMPLETED") {
      const donorEmail = payment.buyerEmailAddress ?? "unknown donor";
      const amount = payment.amountMoney?.amount
        ? (Number(payment.amountMoney.amount) / 100).toFixed(2)
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
            // Email delivery failing shouldn't make Square retry the webhook.
          });
      }
    }
  }

  return NextResponse.json({ received: true });
}
