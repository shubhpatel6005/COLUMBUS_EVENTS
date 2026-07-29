import { NextResponse } from "next/server";

import { getGalleryPhotos } from "@/lib/drive";

export const revalidate = 3600;

export async function GET() {
  if (!process.env.DRIVE_FOLDER_ID) {
    return NextResponse.json(
      { error: "Gallery is not configured yet." },
      { status: 503 },
    );
  }

  try {
    const photos = await getGalleryPhotos();
    return NextResponse.json({ photos });
  } catch {
    return NextResponse.json(
      { error: "Could not load the gallery right now." },
      { status: 502 },
    );
  }
}
