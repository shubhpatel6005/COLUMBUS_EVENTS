"use client";

import Image from "next/image";

import type { Sponsor } from "@/content/sponsors";
import { useReducedMotion } from "@/lib/use-reduced-motion";

function LogoTile({ sponsor }: { sponsor: Sponsor }) {
  return (
    <div className="mx-4 flex w-44 shrink-0 flex-col items-center sm:w-52">
      <div className="flex h-24 w-full items-center justify-center rounded-lg bg-white p-3 shadow-sm sm:h-28 sm:p-4">
        <Image
          src={sponsor.logoSrc}
          alt={sponsor.name}
          width={sponsor.width}
          height={sponsor.height}
          className="h-full w-full object-contain"
        />
      </div>
      <p className="mt-2 text-center font-heading text-sm font-semibold text-foreground">
        {sponsor.name}
      </p>
    </div>
  );
}

export function LogoMarquee({ sponsors }: { sponsors: Sponsor[] }) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <div className="flex flex-wrap items-center justify-center">
        {sponsors.map((sponsor) => (
          <LogoTile key={sponsor.name} sponsor={sponsor} />
        ))}
      </div>
    );
  }

  return (
    <div className="group overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
      <div className="flex w-max animate-[marquee_50s_linear_infinite] group-hover:[animation-play-state:paused]">
        {[...sponsors, ...sponsors].map((sponsor, index) => (
          <LogoTile key={`${sponsor.name}-${index}`} sponsor={sponsor} />
        ))}
      </div>
    </div>
  );
}
