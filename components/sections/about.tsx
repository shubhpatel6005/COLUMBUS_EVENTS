import { PlaceholderMark } from "@/components/content/placeholder-mark";
import { about } from "@/content/about";

export function About() {
  return (
    <section
      id="about"
      className="scroll-mt-16 border-t border-border bg-background px-4 py-24"
    >
      <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2 md:items-start">
        <div>
          <p className="font-heading text-sm font-semibold tracking-widest text-rapids-teal uppercase">
            About
          </p>
          <h2 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
            <PlaceholderMark>{about.orgName}</PlaceholderMark>
          </h2>
          <p className="mt-6 text-lg text-foreground">
            <PlaceholderMark>{about.mission}</PlaceholderMark>
          </p>
          <p className="mt-4 text-muted-foreground">
            <PlaceholderMark>{about.whoRunsIt}</PlaceholderMark>
          </p>
        </div>

        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-3 md:grid-cols-1">
          {about.stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-border bg-card px-6 py-5"
            >
              <dt className="sr-only">{stat.label}</dt>
              <dd className="font-heading text-3xl font-bold text-primary">
                <PlaceholderMark>{stat.value}</PlaceholderMark>
              </dd>
              <p className="mt-1 text-sm text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
