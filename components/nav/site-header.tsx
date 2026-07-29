"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { MobileMenu, type NavSection } from "./mobile-menu";

const SECTIONS: NavSection[] = [
  { id: "about", label: "About" },
  { id: "gallery", label: "Gallery" },
  { id: "sponsors", label: "Sponsors" },
  { id: "donate", label: "Donate" },
  { id: "contact", label: "Contact" },
];

export function SiteHeader() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (mostVisible) setActiveId(mostVisible.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    for (const { id } of SECTIONS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href="#hero"
            className="font-heading text-lg font-bold uppercase tracking-tight text-foreground"
          >
            Columbus Events
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                aria-current={activeId === section.id ? "true" : undefined}
                className={
                  activeId === section.id
                    ? "text-sm font-medium text-primary"
                    : "text-sm font-medium text-foreground/70 hover:text-foreground"
                }
              >
                {section.label}
              </a>
            ))}
          </nav>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            className="flex size-10 items-center justify-center rounded-lg text-foreground hover:bg-muted md:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="size-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </header>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sections={SECTIONS}
        activeId={activeId}
        triggerRef={menuButtonRef}
      />
    </>
  );
}
