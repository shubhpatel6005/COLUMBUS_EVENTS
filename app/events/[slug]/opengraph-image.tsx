import { ImageResponse } from "next/og";

import { events, getEventBySlug } from "@/content/events";

export function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }));
}

export const alt = "Columbus Indian Community Events";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  const title = event?.title ?? "Columbus Indian Community Events";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#2D1B4E",
          color: "#F6F1E4",
          padding: "80px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: "#E08A2E",
            marginBottom: 24,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          Columbus Indian Community Events
        </div>
        <div style={{ fontSize: 60, fontWeight: 700 }}>{title}</div>
      </div>
    ),
    { ...size },
  );
}
