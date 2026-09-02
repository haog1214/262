import { google } from "googleapis";
import { Readable } from "stream";

function getDrive() {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  if (!clientId || !clientSecret || !refreshToken || !folderId) {
    throw new Error("Missing Google Drive OAuth env vars");
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  return { drive: google.drive({ version: "v3", auth: oauth2Client }), folderId };
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
  return Boolean(
    process.env.GOOGLE_OAUTH_CLIENT_ID &&
      process.env.GOOGLE_OAUTH_CLIENT_SECRET &&
      process.env.GOOGLE_OAUTH_REFRESH_TOKEN &&
      process.env.GOOGLE_DRIVE_FOLDER_ID
  );
}
