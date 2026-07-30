import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section
      id="hero"
      className="scroll-mt-20 grid w-full md:grid-cols-2 md:items-stretch"
    >
      <div className="relative isolate aspect-[4/3] w-full overflow-hidden md:aspect-auto md:h-[640px]">
        <Image
          src="/images/hero/hero-statue.jpg"
          alt="Stone statue with hands folded in a prayer gesture"
          width={1600}
          height={2400}
          priority
          className="h-full w-full object-cover object-top grayscale"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-deep-violet from-10% via-deep-violet/80 via-40% to-marigold mix-blend-color" />
      </div>

      <div className="flex flex-col justify-center gap-6 bg-background px-6 py-16 sm:px-12 md:h-[640px] md:px-16">
        <h1 className="font-heading text-4xl font-bold tracking-tight uppercase text-foreground sm:text-5xl">
          Columbus <span className="text-turmeric">Indian</span> Community
          Events
        </h1>
        <p className="text-lg text-muted-foreground">
          Free, inclusive cultural events for Columbus, Georgia — from the
          joyous festivities of Navratri to the colorful kite-flying
          extravaganza of Uttrayan.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="#donate"
            className={cn(
              buttonVariants({ variant: "default" }),
              "h-12 px-6 text-base",
            )}
          >
            Support Our Events
          </Link>
          <Link
            href="#gallery"
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "h-12 px-6 text-base",
            )}
          >
            See Event Photos
          </Link>
        </div>
      </div>
    </section>
  );
}
