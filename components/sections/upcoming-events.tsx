"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { events } from "@/content/events";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const ROTATE_INTERVAL_MS = 4000;

export function UpcomingEvents() {
  const [offset, setOffset] = useState(0);
  const [paused, setPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (paused || shouldReduceMotion || events.length <= 1) return;

    const id = setInterval(() => {
      setOffset((current) => (current + 1) % events.length);
    }, ROTATE_INTERVAL_MS);

    return () => clearInterval(id);
  }, [paused, shouldReduceMotion]);

  if (events.length === 0) return null;

  const ordered = [...events.slice(offset), ...events.slice(0, offset)];

  return (
    <section
      id="events"
      className="scroll-mt-20 border-t border-border bg-background px-4 py-16"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-5xl">
        <p className="text-center font-heading text-sm font-semibold tracking-widest text-turmeric uppercase">
          Upcoming
        </p>
        <h2 className="mt-2 text-center font-heading text-2xl font-bold text-foreground sm:text-3xl">
          Next Event
        </h2>

        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {ordered.map((event) => (
            <motion.div
              key={event.slug}
              layout
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="flex flex-col items-center text-center"
            >
              <Link
                href={`/events/${event.slug}`}
                className="block w-full overflow-hidden rounded-lg"
              >
                <Image
                  src={event.imageSrc}
                  alt={event.title}
                  width={724}
                  height={1024}
                  className="aspect-[724/1024] w-full object-cover"
                />
              </Link>
              <p className="mt-4 text-sm text-turmeric">
                {new Date(event.startDateTime).toLocaleDateString("en-US", {
                  dateStyle: "long",
                })}
              </p>
              <p className="mt-1 font-heading text-lg font-semibold text-foreground">
                {event.title}
              </p>
              <a
                href={event.ticketUrl}
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "mt-4 h-12 w-full bg-[#ebddd2] px-6 font-heading text-base text-marigold hover:bg-primary hover:text-ivory active:bg-primary active:text-ivory",
                )}
              >
                Get Tickets
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
