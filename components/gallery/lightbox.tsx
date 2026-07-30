"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import type { GalleryPhoto } from "@/lib/drive";

export function Lightbox({
  photo,
  onClose,
  onNext,
  onPrev,
}: {
  photo: GalleryPhoto;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const focusable = container?.querySelectorAll<HTMLElement>("button");
    const first = focusable?.[0];
    const last = focusable?.[focusable.length - 1];
    first?.focus();

    function handleKeyDown(event: KeyboardEvent) {
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
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [photo.id]);

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={photo.name || "Event photo"}
      className="fixed inset-0 z-50 flex items-center justify-center bg-deep-violet/90 p-4"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-lg text-ivory hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-marigold"
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

      <button
        type="button"
        onClick={onPrev}
        aria-label="Previous photo"
        className="absolute top-1/2 left-4 flex size-10 -translate-y-1/2 items-center justify-center rounded-lg text-ivory hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-marigold"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="size-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <Image
        src={`/api/photo/${photo.id}`}
        alt={photo.name}
        width={photo.width}
        height={photo.height}
        priority
        className="max-h-[85vh] w-auto max-w-full rounded-lg object-contain"
      />

      <button
        type="button"
        onClick={onNext}
        aria-label="Next photo"
        className="absolute top-1/2 right-4 flex size-10 -translate-y-1/2 items-center justify-center rounded-lg text-ivory hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-marigold"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="size-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}
