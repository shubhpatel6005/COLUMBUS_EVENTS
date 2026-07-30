import Link from "next/link";

import { PlaceholderMark } from "@/components/content/placeholder-mark";
import { events } from "@/content/events";

export function UpcomingEvents() {
  if (events.length === 0) return null;

  return (
    <section
      id="events"
      className="scroll-mt-20 border-t border-border bg-background px-4 py-16"
    >
      <div className="mx-auto max-w-3xl">
        <p className="text-center font-heading text-sm font-semibold tracking-widest text-turmeric uppercase">
          Upcoming
        </p>
        <h2 className="mt-2 text-center font-heading text-2xl font-bold text-foreground sm:text-3xl">
          Next Event
        </h2>

        <ul className="mt-8 space-y-4">
          {events.map((event) => (
            <li key={event.slug}>
              <Link
                href={`/events/${event.slug}`}
                className="block rounded-lg border border-border bg-card px-6 py-5 hover:bg-muted"
              >
                <p className="text-sm text-turmeric">
                  {new Date(event.startDateTime).toLocaleDateString("en-US", {
                    dateStyle: "long",
                  })}
                </p>
                <p className="mt-1 font-heading text-lg font-semibold text-foreground">
                  <PlaceholderMark>{event.title}</PlaceholderMark>
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
