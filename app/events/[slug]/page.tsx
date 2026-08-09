import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { events, getEventBySlug } from "@/content/events";
import { googleCalendarUrl } from "@/lib/ics";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) return {};

  return {
    title: `${event.title} — Columbus Indian Community Events`,
    description: event.description,
  };
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: event.startDateTime,
    endDate: event.endDateTime,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    image: `${siteUrl}${event.imageSrc}`,
    location: {
      "@type": "Place",
      name: event.locationName,
      address: event.address,
    },
    organizer: {
      "@type": "Organization",
      name: "Columbus Indian Community Events, Inc.",
      url: siteUrl,
    },
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Image
        src={event.imageSrc}
        alt={event.title}
        width={724}
        height={1024}
        priority
        className="mx-auto h-auto w-full max-w-xs rounded-lg"
      />

      <p className="mt-8 font-heading text-sm font-semibold tracking-widest text-turmeric uppercase">
        Event
      </p>
      <h1 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
        {event.title}
      </h1>
      <p className="mt-4 text-lg text-foreground">{event.description}</p>

      <dl className="mt-6 space-y-2 text-sm text-muted-foreground">
        <div>
          <dt className="inline font-medium text-foreground">When: </dt>
          <dd className="inline">
            {new Date(event.startDateTime).toLocaleString("en-US", {
              dateStyle: "full",
              timeStyle: "short",
            })}
          </dd>
        </div>
        <div>
          <dt className="inline font-medium text-foreground">Where: </dt>
          <dd className="inline">{`${event.locationName}, ${event.address}`}</dd>
        </div>
      </dl>

      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href={event.ticketUrl}
          className={cn(
            buttonVariants({ variant: "default" }),
            "h-11 bg-[#ebddd2] px-5 font-heading text-marigold hover:bg-primary hover:text-ivory active:bg-primary active:text-ivory",
          )}
        >
          Get Tickets
        </a>
        <a
          href={`/api/events/${event.slug}/ics`}
          className={cn(buttonVariants({ variant: "default" }), "h-11 px-5")}
        >
          Add to Calendar (.ics)
        </a>
        <a
          href={googleCalendarUrl(event)}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: "secondary" }), "h-11 px-5")}
        >
          Add to Google Calendar
        </a>
      </div>

      <Link
        href="/"
        className="mt-10 inline-block text-sm text-turmeric hover:underline"
      >
        ← Back to the site
      </Link>
    </main>
  );
}
