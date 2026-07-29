import { NextResponse } from "next/server";

import { getEventBySlug } from "@/content/events";
import { generateIcs } from "@/lib/ics";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) {
    return new NextResponse("Not found", { status: 404 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const ics = generateIcs(event, siteUrl);

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${event.slug}.ics"`,
    },
  });
}
