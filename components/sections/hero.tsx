import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RiverLine } from "./river-line";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative isolate scroll-mt-16 overflow-hidden bg-background px-4 py-24 sm:py-32"
    >
      <RiverLine className="pointer-events-none absolute inset-x-0 top-1/2 h-40 w-full -translate-y-1/2 opacity-40" />

      <div className="relative mx-auto max-w-3xl text-center">
        <h1 className="font-heading text-4xl font-bold tracking-tight uppercase text-foreground sm:text-5xl md:text-6xl">
          Columbus <span className="text-brass">Indian</span> Community
          Events
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Community events for Columbus, Georgia — rooted Uptown, carried by
          the river.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="#donate"
            className={cn(buttonVariants({ variant: "default" }), "h-12 px-6 text-base")}
          >
            Support Our Events
          </Link>
          <Link
            href="#gallery"
            className={cn(buttonVariants({ variant: "secondary" }), "h-12 px-6 text-base")}
          >
            See Event Photos
          </Link>
        </div>
      </div>
    </section>
  );
}
