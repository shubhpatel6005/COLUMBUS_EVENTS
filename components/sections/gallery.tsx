import { Suspense } from "react";

import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { localGalleryPhotos } from "@/content/gallery";
import { getGalleryPhotos, type GalleryPhoto } from "@/lib/drive";
import { GallerySkeleton } from "./gallery-skeleton";

async function GalleryContent() {
  let drivePhotos: GalleryPhoto[] = [];
  if (process.env.DRIVE_FOLDER_ID) {
    try {
      drivePhotos = await getGalleryPhotos();
    } catch {
      // Fall through to local photos — Drive being unavailable shouldn't
      // hide the photos we already have.
    }
  }

  const photos = [...localGalleryPhotos, ...drivePhotos];

  if (photos.length === 0) {
    return (
      <p className="text-center text-muted-foreground">
        No event photos yet — check back after our next event.
      </p>
    );
  }

  return <GalleryGrid photos={photos} />;
}

export function Gallery() {
  return (
    <section
      id="gallery"
      className="scroll-mt-20 border-t border-border bg-background px-4 py-24"
    >
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="font-heading text-sm font-semibold tracking-widest text-turmeric uppercase">
            Gallery
          </p>
          <h2 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Event Pictures
          </h2>
        </div>

        <div className="mt-10">
          <Suspense fallback={<GallerySkeleton />}>
            <GalleryContent />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
