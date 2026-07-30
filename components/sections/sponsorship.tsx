import Link from "next/link";

import { PlaceholderMark } from "@/components/content/placeholder-mark";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { currentSponsors, sponsorTiers } from "@/content/sponsors";

export function Sponsorship() {
  return (
    <section
      id="sponsors"
      className="scroll-mt-20 border-t border-border bg-background px-4 py-24"
    >
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="font-heading text-sm font-semibold tracking-widest text-turmeric uppercase">
            Sponsorship
          </p>
          <h2 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Partner with our events
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {sponsorTiers.map((tier) => (
            <div
              key={tier.name}
              className="flex flex-col rounded-lg border border-border bg-card p-6"
            >
              <p className="font-heading text-lg font-semibold text-foreground">
                {tier.name}
              </p>
              <p className="mt-1 font-heading text-3xl font-bold text-turmeric">
                <PlaceholderMark>{tier.price}</PlaceholderMark>
              </p>
              <ul className="mt-4 flex-1 space-y-2 text-sm text-muted-foreground">
                {tier.perks.map((perk) => (
                  <li key={perk}>
                    <PlaceholderMark>{perk}</PlaceholderMark>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          {currentSponsors.length > 0 ? (
            <div className="flex flex-wrap items-center justify-center gap-8">
              {currentSponsors.map((sponsor) => (
                <span
                  key={sponsor.name}
                  className="text-sm font-medium text-muted-foreground"
                >
                  {sponsor.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              We&apos;re looking for our first sponsors — be the first to
              partner with us.
            </p>
          )}
        </div>

        <div className="mt-10 flex flex-col items-center gap-3">
          <Link
            href="#contact"
            className={cn(buttonVariants({ variant: "default" }), "h-12 px-6 text-base")}
          >
            Become a Sponsor
          </Link>
          <p className="text-xs text-muted-foreground">
            Sponsor deck PDF coming soon.
          </p>
        </div>
      </div>
    </section>
  );
}
