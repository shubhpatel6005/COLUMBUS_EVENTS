import { PlaceholderMark } from "@/components/content/placeholder-mark";
import { about } from "@/content/about";

export function About() {
  return (
    <section
      id="about"
      className="scroll-mt-20 border-t border-border bg-[#ebddd2] px-4 py-32"
    >
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-heading text-4xl font-bold text-foreground sm:text-5xl">
          <PlaceholderMark>{about.orgName}</PlaceholderMark>
        </h2>
        <p className="mt-8 text-xl text-foreground">
          <PlaceholderMark>{about.mission}</PlaceholderMark>
        </p>
        <p className="mt-6 text-lg text-foreground">
          <PlaceholderMark>{about.whoRunsIt}</PlaceholderMark>
        </p>
      </div>
    </section>
  );
}
