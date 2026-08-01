import { google } from "googleapis";
import { unstable_cache } from "next/cache";

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});

export const drive = google.drive({ version: "v3", auth });

export type GalleryPhoto = {
  id: string;
  name: string;
  width: number;
  height: number;
  src: string;
};

async function listGalleryPhotos(): Promise<GalleryPhoto[]> {
  const folderId = process.env.DRIVE_FOLDER_ID;
  if (!folderId) return [];

  const res = await drive.files.list({
    q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
    fields: "files(id,name,imageMediaMetadata(width,height),modifiedTime)",
    orderBy: "modifiedTime desc",
    pageSize: 100,
  });

  return (res.data.files ?? [])
    .filter((file) => file.id)
    .map((file) => ({
      id: file.id as string,
      name: file.name ?? "",
      width: file.imageMediaMetadata?.width ?? 1200,
      height: file.imageMediaMetadata?.height ?? 800,
      src: `/api/photo/${file.id}`,
    }));
}

// Shared 1-hour cache so both the /api/gallery route and the gallery
// section's server render hit the Drive API at most once per hour combined.
export const getGalleryPhotos = unstable_cache(
  listGalleryPhotos,
  ["gallery-photos"],
  { revalidate: 3600 },
);
