import { google } from "googleapis";
import { Readable } from "stream";

function getDrive() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  if (!raw || !folderId) throw new Error("Missing Google Drive env vars");

  const credentials = JSON.parse(raw);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/drive"],
  });
  return { drive: google.drive({ version: "v3", auth }), folderId };
}

const MIME_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export async function uploadImageToDrive(
  buffer: Buffer,
  safeName: string,
  ext: string
): Promise<string> {
  const { drive, folderId } = getDrive();

  const file = await drive.files.create({
    requestBody: {
      name: safeName,
      parents: [folderId],
    },
    media: {
      mimeType: MIME_BY_EXT[ext] ?? "application/octet-stream",
      body: Readable.from(buffer),
    },
    fields: "id",
  });

  const fileId = file.data.id;
  if (!fileId) throw new Error("Drive upload did not return a file id");

  await drive.permissions.create({
    fileId,
    requestBody: { role: "reader", type: "anyone" },
  });

  return `https://lh3.googleusercontent.com/d/${fileId}`;
}

export function driveIsConfigured(): boolean {
  return Boolean(process.env.GOOGLE_SERVICE_ACCOUNT_JSON && process.env.GOOGLE_DRIVE_FOLDER_ID);
}
