import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import sharp from "sharp";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const MAX_BYTES = 5 * 1024 * 1024; // 5MB — pre-compression upload cap
const MAX_DIMENSION = 2000; // longest edge, px — plenty for any on-site display

// Deliberately NOT under public/: next start snapshots the public/
// directory at boot and won't serve files written there after the server
// has started (works fine in `next dev`, which checks the filesystem live —
// this gap only shows up in production). Uploads are served instead by the
// route handler at app/uploads/[...path]/route.ts, which reads from disk
// fresh on every request.
export const UPLOAD_DIR = path.join(process.cwd(), "uploads");

export class UploadError extends Error {}

/** Validates and writes an uploaded image to UPLOAD_DIR, returning its
 * public URL path (e.g. "/uploads/abc123.jpg"). Docker mounts a volume at
 * UPLOAD_DIR so files survive redeploys without touching the database. */
export async function saveUploadedImage(file: File): Promise<string> {
  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    throw new UploadError("Unsupported file type — use JPEG, PNG, WebP, or GIF.");
  }
  if (file.size > MAX_BYTES) {
    throw new UploadError("File is too large — 5MB maximum.");
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  const filename = `${randomUUID()}.${ext}`;
  const inputBuffer = Buffer.from(await file.arrayBuffer());
  const outputBuffer = await compress(inputBuffer, file.type);
  await writeFile(path.join(UPLOAD_DIR, filename), outputBuffer);

  return `/uploads/${filename}`;
}

/** Resizes to a sane max dimension and re-encodes at a reasonable quality
 * so uploads from a phone camera (often several MB) don't ship at full
 * size to every visitor. Animated GIFs pass through untouched — resizing
 * would require frame-by-frame handling that isn't worth it here. */
async function compress(buffer: Buffer, mimeType: string): Promise<Buffer> {
  if (mimeType === "image/gif") return buffer;

  const pipeline = sharp(buffer)
    .rotate()
    .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: "inside", withoutEnlargement: true });

  if (mimeType === "image/png") return pipeline.png({ compressionLevel: 9 }).toBuffer();
  if (mimeType === "image/webp") return pipeline.webp({ quality: 82 }).toBuffer();
  return pipeline.jpeg({ quality: 82, mozjpeg: true }).toBuffer();
}

/** Best-effort delete of a previously uploaded image, given its public URL. */
export async function deleteUploadedImage(url: string | null | undefined) {
  if (!url || !url.startsWith("/uploads/")) return;
  const filename = url.slice("/uploads/".length);
  if (!filename || filename.includes("/") || filename.includes("..")) return;
  try {
    await unlink(path.join(UPLOAD_DIR, filename));
  } catch {
    // already gone — fine
  }
}
