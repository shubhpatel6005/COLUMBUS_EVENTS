// TODO(content): flyers only list the date, not a start/end time — confirmed
// with the venue before launch. Also need a real ticket URL for `ticketUrl`
// on each event (currently "#" placeholders). See CLAUDE.md "Content TODOs".
export type EventItem = {
  slug: string;
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  locationName: string;
  address: string;
  imageSrc: string;
  ticketUrl: string;
};

const VENUE = {
  locationName: "Columbus Civic Center",
  address: "400 4th Street, Columbus, GA 31901",
};

export const events: EventItem[] = [
  {
    slug: "garba-night-geeta-rabari",
    title: "6th Annual Garba Musical Night — Geeta Rabari",
    description:
      "Join Columbus Indian Community Events, Inc. for the 6th Annual Garba Musical Night featuring Geeta Rabari — an evening of music, dance, and community celebration.",
    startDateTime: "2026-09-04T19:00:00-04:00",
    endDateTime: "2026-09-04T23:00:00-04:00",
    ...VENUE,
    imageSrc: "/images/events/garba-night-geeta-rabari.jpg",
    ticketUrl: "#",
  },
  {
    slug: "garba-night-divya-chaudhary",
    title: "6th Annual Garba Musical Night — Divya Chaudhary",
    description:
      "Join Columbus Indian Community Events, Inc. for the 6th Annual Garba Musical Night featuring Divya Chaudhary — an evening of music, dance, and community celebration.",
    startDateTime: "2026-09-05T19:00:00-04:00",
    endDateTime: "2026-09-05T23:00:00-04:00",
    ...VENUE,
    imageSrc: "/images/events/garba-night-divya-chaudhary.jpg",
    ticketUrl: "#",
  },
  {
    slug: "garba-night-aishwaria-majumdar",
    title: "6th Annual Garba Musical Night — Aishwaria Majumdar",
    description:
      "Join Columbus Indian Community Events, Inc. for the 6th Annual Garba Musical Night featuring Aishwaria Majumdar — an evening of music, dance, and community celebration.",
    startDateTime: "2026-09-06T19:00:00-04:00",
    endDateTime: "2026-09-06T23:00:00-04:00",
    ...VENUE,
    imageSrc: "/images/events/garba-night-aishwaria-majumdar.jpg",
    ticketUrl: "#",
  },
];

export function getEventBySlug(slug: string): EventItem | undefined {
  return events.find((event) => event.slug === slug);
}
