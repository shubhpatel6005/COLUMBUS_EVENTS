"use client";

import { useEffect, useRef } from "react";

export type NavSection = { id: string; label: string };

export function MobileMenu({
  open,
  onClose,
  sections,
  activeId,
  triggerRef,
}: {
  open: boolean;
  onClose: () => void;
  sections: NavSection[];
  activeId: string | null;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const container = containerRef.current;
    const focusable = container?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])',
    );
    const first = focusable?.[0];
    const last = focusable?.[focusable.length - 1];
    first?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !focusable || focusable.length === 0) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    const trigger = triggerRef.current;
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      trigger?.focus();
    };
  }, [open, onClose, triggerRef]);

  if (!open) return null;

  return (
    <div
      ref={containerRef}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Main menu"
      className="fixed inset-0 z-50 flex flex-col bg-background md:hidden"
    >
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <span className="font-heading text-lg font-bold uppercase text-foreground">
          Columbus Events
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="flex size-10 items-center justify-center rounded-lg text-foreground hover:bg-muted"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="size-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <nav className="flex flex-1 flex-col items-center justify-center gap-8">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            onClick={onClose}
            aria-current={activeId === section.id ? "true" : undefined}
            className={
              activeId === section.id
                ? "font-heading text-2xl font-semibold uppercase text-primary"
                : "font-heading text-2xl font-semibold uppercase text-foreground"
            }
          >
            {section.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
