import Image from "next/image";

import { buttonVariants } from "@/components/ui/button";
import { events } from "@/content/events";
import { cn } from "@/lib/utils";

const POSTER_IMAGE_SRC = "/images/events/Temp1.jpg";
const SINGLE_DAY_PRICE = "$15";
const COMBO_PRICE = "$30";
const COMBO_TICKET_URL = "https://mcsms.io/spA5mC";
const COMBO_DATE = "September 4-6, 2026";

type TicketOption = {
  key: string;
  name: string;
  date: string;
  price: string;
  ticketUrl: string;
};

const ticketOptions: TicketOption[] = [
  ...events.map((event) => ({
    key: event.slug,
    name: event.title,
    date: new Date(event.startDateTime).toLocaleDateString("en-US", {
      dateStyle: "long",
    }),
    price: SINGLE_DAY_PRICE,
    ticketUrl: event.ticketUrl,
  })),
  {
    key: "combo",
    name: "6th Annual Garba Musical Night — Combo",
    date: COMBO_DATE,
    price: COMBO_PRICE,
    ticketUrl: COMBO_TICKET_URL,
  },
];

export function UpcomingEvents() {
  if (events.length === 0) return null;

  return (
    <section
      id="events"
      className="scroll-mt-20 border-t border-border bg-background px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="mx-auto max-w-[73.6rem]">
        <p className="text-center font-heading text-sm font-semibold tracking-widest text-turmeric uppercase">
          Upcoming
        </p>
        <h2 className="mt-2 text-center font-heading text-2xl font-bold text-foreground sm:text-3xl">
          Next Event
        </h2>

        <div className="mx-auto mt-8 max-w-xs overflow-hidden rounded-lg sm:mt-10 sm:max-w-sm md:max-w-md lg:max-w-lg">
          <Image
            src={POSTER_IMAGE_SRC}
            alt="6th Annual Garba Musical Night 2026 — September 4-6, Columbus Civic Center"
            width={992}
            height={1586}
            className="aspect-[992/1586] w-full object-cover"
          />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {ticketOptions.map((option) => (
            <div
              key={option.key}
              className="flex flex-col items-center text-center"
            >
              <p className="text-sm text-turmeric">{option.date}</p>
              <p className="mt-1 font-heading text-lg font-semibold text-foreground">
                {option.name}
              </p>
              <p className="mt-1 text-sm text-turmeric">{option.price}</p>
              <a
                href={option.ticketUrl}
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "mt-4 h-12 w-full bg-[#ebddd2] px-6 font-heading text-base text-marigold hover:bg-primary hover:text-ivory active:bg-primary active:text-ivory",
                )}
              >
                Get Tickets
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
