import { about } from "@/content/about";

export function About() {
  return (
    <section
      id="about"
      className="scroll-mt-20 border-t border-border bg-deep-violet px-4 py-32"
    >
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-heading text-4xl font-bold text-marigold sm:text-5xl">
          {about.orgName}
        </h2>
        <p className="mt-8 text-xl text-marigold">{about.mission}</p>
        <p className="mt-6 text-lg text-marigold">{about.whoRunsIt}</p>
      </div>
    </section>
  );
}
