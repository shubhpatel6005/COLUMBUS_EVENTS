import { SiteHeader } from "@/components/nav/site-header";
import { About } from "@/components/sections/about";
import { Gallery } from "@/components/sections/gallery";
import { Hero } from "@/components/sections/hero";
import { Sponsorship } from "@/components/sections/sponsorship";

function StubSection({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  return (
    <section
      id={id}
      className="flex min-h-[50vh] scroll-mt-16 flex-col items-center justify-center border-t border-dashed border-border px-4 text-center"
    >
      <h2 className="font-heading text-2xl font-semibold uppercase text-foreground">
        {title}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Section content coming in a later build session.
      </p>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <Hero />
        <About />
        <Gallery />
        <Sponsorship />
        <StubSection id="donate" title="Donate" />
        <StubSection id="contact" title="Contact" />
      </main>
    </>
  );
}
