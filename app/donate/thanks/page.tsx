import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Thank You — Columbus Community Events",
};

export default function DonateThanksPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="font-heading text-sm font-semibold tracking-widest text-turmeric uppercase">
        Thank you
      </p>
      <h1 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
        Your donation means the world to us
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        A receipt is on its way to your inbox. Thank you for supporting
        community events in Columbus, Georgia.
      </p>
      <Link
        href="/"
        className={cn(buttonVariants({ variant: "default" }), "mt-8 h-12 px-6 text-base")}
      >
        Back to the site
      </Link>
    </main>
  );
}
