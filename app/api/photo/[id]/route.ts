import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { drive } from "@/lib/drive";

const paramsSchema = z.object({
  id: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[\w-]+$/),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const folderId = process.env.DRIVE_FOLDER_ID;
  if (!folderId) {
    return new NextResponse("Not found", { status: 404 });
  }

  const parsed = paramsSchema.safeParse(await params);
  if (!parsed.success) {
    return new NextResponse("Not found", { status: 404 });
  }
  const { id } = parsed.data;

  try {
    const meta = await drive.files.get({
      fileId: id,
      fields: "parents,mimeType",
    });

    if (!meta.data.parents?.includes(folderId)) {
      return new NextResponse("Not found", { status: 404 });
    }

    const file = await drive.files.get(
      { fileId: id, alt: "media" },
      { responseType: "arraybuffer" },
    );

    return new NextResponse(file.data as ArrayBuffer, {
      headers: {
        "Content-Type": meta.data.mimeType ?? "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
