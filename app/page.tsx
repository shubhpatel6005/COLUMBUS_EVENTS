import { SiteHeader } from "@/components/nav/site-header";
import { Hero } from "@/components/sections/hero";

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
        <StubSection id="about" title="About" />
        <StubSection id="gallery" title="Event Pictures" />
        <StubSection id="sponsors" title="Sponsorship" />
        <StubSection id="donate" title="Donate" />
        <StubSection id="contact" title="Contact" />
      </main>
    </>
  );
}
