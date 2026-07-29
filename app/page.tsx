import { SiteHeader } from "@/components/nav/site-header";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Donate } from "@/components/sections/donate";
import { Gallery } from "@/components/sections/gallery";
import { Hero } from "@/components/sections/hero";
import { Sponsorship } from "@/components/sections/sponsorship";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <Hero />
        <About />
        <Gallery />
        <Sponsorship />
        <Donate />
        <Contact />
      </main>
    </>
  );
}
