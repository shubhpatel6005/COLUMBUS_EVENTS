// TODO(content): replace with real upcoming events before launch. See
// CLAUDE.md "Content TODOs". Dates use ISO 8601 with an explicit UTC offset
// so calendar exports and JSON-LD both resolve to the correct local time.
export type EventItem = {
  slug: string;
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  locationName: string;
  address: string;
};

export const events: EventItem[] = [
  {
    slug: "example-riverwalk-cleanup",
    title: "[Event name — e.g. Riverwalk Cleanup Day]",
    description:
      "[One to two sentence description of what this event is and who it's for.]",
    startDateTime: "2026-09-12T09:00:00-04:00",
    endDateTime: "2026-09-12T12:00:00-04:00",
    locationName: "[Venue name, e.g. Chattahoochee RiverWalk]",
    address: "[Street address, Columbus, GA ZIP]",
  },
];

export function getEventBySlug(slug: string): EventItem | undefined {
  return events.find((event) => event.slug === slug);
}
