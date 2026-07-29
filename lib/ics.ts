import type { EventItem } from "@/content/events";

function formatIcsDate(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

export function generateIcs(event: EventItem, siteUrl: string): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Columbus Community Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.slug}@columbusgaevents`,
    `DTSTAMP:${formatIcsDate(new Date().toISOString())}`,
    `DTSTART:${formatIcsDate(event.startDateTime)}`,
    `DTEND:${formatIcsDate(event.endDateTime)}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `DESCRIPTION:${escapeIcsText(event.description)}`,
    `LOCATION:${escapeIcsText(`${event.locationName}, ${event.address}`)}`,
    `URL:${siteUrl}/events/${event.slug}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}

export function googleCalendarUrl(event: EventItem): string {
  const dates = `${formatIcsDate(event.startDateTime)}/${formatIcsDate(event.endDateTime)}`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates,
    details: event.description,
    location: `${event.locationName}, ${event.address}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
