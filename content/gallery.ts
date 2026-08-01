import type { GalleryPhoto } from "@/lib/drive";

// Real photos from past events, dropped in public/images/PHOTOS and
// resized/compressed into public/images/gallery. Shown alongside (or in
// place of, until Drive is configured) the Google Drive gallery.
export const localGalleryPhotos: GalleryPhoto[] = [
  {
    id: "local-dsc-5809",
    name: "Singer performing on stage at a past Garba Night",
    src: "/images/gallery/DSC_5809.jpg",
    width: 1065,
    height: 1600,
  },
  {
    id: "local-dsc-5915",
    name: "Performer greeting an excited crowd at the Columbus Civic Center",
    src: "/images/gallery/DSC_5915.jpg",
    width: 1600,
    height: 1065,
  },
  {
    id: "local-vip-8545",
    name: "Garba dancers in traditional dress dancing in a circle",
    src: "/images/gallery/VIP_8545.jpg",
    width: 1600,
    height: 1067,
  },
  {
    id: "local-vip-8570",
    name: "Community leaders and sponsors posing together with flowers",
    src: "/images/gallery/VIP_8570.jpg",
    width: 1600,
    height: 1067,
  },
  {
    id: "local-vip-8714",
    name: "Singer performing on stage in traditional dress",
    src: "/images/gallery/VIP_8714.jpg",
    width: 1067,
    height: 1600,
  },
];
