"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import type { GalleryPhoto } from "@/lib/drive";
import { Lightbox } from "./lightbox";

export function GalleryGrid({ photos }: { photos: GalleryPhoto[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function close() {
    setOpenIndex((current) => {
      if (current !== null) triggerRefs.current[current]?.focus();
      return null;
    });
  }

  function showNext() {
    setOpenIndex((current) =>
      current === null ? current : (current + 1) % photos.length,
    );
  }

  function showPrev() {
    setOpenIndex((current) =>
      current === null
        ? current
        : (current - 1 + photos.length) % photos.length,
    );
  }

  useEffect(() => {
    if (openIndex === null) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      else if (event.key === "ArrowRight") showNext();
      else if (event.key === "ArrowLeft") showPrev();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openIndex, photos.length]);

  return (
    <>
      <div className="columns-2 gap-4 sm:columns-3">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            ref={(el) => {
              triggerRefs.current[index] = el;
            }}
            type="button"
            onClick={() => setOpenIndex(index)}
            className="group relative mb-4 block w-full overflow-hidden rounded-lg bg-muted hover:[perspective:1000px] focus-visible:[perspective:1000px] focus-visible:ring-2 focus-visible:ring-ring"
            style={{
              breakInside: "avoid",
              aspectRatio: `${photo.width} / ${photo.height}`,
            }}
          >
            <div className="relative h-full w-full transition-transform duration-700 group-hover:[transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-focus-visible:[transform-style:preserve-3d] group-focus-visible:[transform:rotateY(180deg)] motion-reduce:transition-none motion-reduce:group-hover:[transform:none] motion-reduce:group-focus-visible:[transform:none]">
              <Image
                src={photo.src}
                alt={photo.name}
                width={photo.width}
                height={photo.height}
                sizes="(min-width: 640px) 33vw, 50vw"
                loading="eager"
                className="absolute inset-0 h-full w-full object-cover [backface-visibility:hidden]"
              />
              <Image
                src={photo.src}
                alt={photo.name}
                width={photo.width}
                height={photo.height}
                sizes="(min-width: 640px) 33vw, 50vw"
                loading="eager"
                className="absolute inset-0 h-full w-full object-cover [backface-visibility:hidden] [transform:rotateY(180deg)]"
              />
            </div>
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <Lightbox
          photo={photos[openIndex]}
          onClose={close}
          onNext={showNext}
          onPrev={showPrev}
        />
      )}
    </>
  );
}
