import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const MAX_BYTES = 5 * 1024 * 1024; // 5MB

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export class UploadError extends Error {}

/** Validates and writes an uploaded image to public/uploads, returning its
 * public URL path (e.g. "/uploads/abc123.jpg"). Docker mounts a volume at
 * public/uploads so files survive redeploys without touching the database. */
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
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);

  return `/uploads/${filename}`;
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
