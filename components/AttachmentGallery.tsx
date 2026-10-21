"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "./Lightbox";

type Attachment = { id: number; type: string; label: string | null; url: string };

export default function AttachmentGallery({ attachments }: { attachments: Attachment[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  if (attachments.length === 0) return null;

  const images = attachments.filter((a) => a.type === "IMAGE");
  const others = attachments.filter((a) => a.type !== "IMAGE");
  const cover = images[0];

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      {cover && (
        <button
          type="button"
          onClick={() => setLightboxIndex(0)}
          className="group relative h-40 w-60 overflow-hidden rounded-lg border border-black/10 transition hover:border-accent"
        >
          <Image src={cover.url} alt={cover.label ?? "Attachment"} fill sizes="240px" className="object-cover" />
          {images.length > 1 && (
            <span className="absolute bottom-2 right-2 rounded-full bg-ink/80 px-3 py-1.5 font-mono text-xs font-semibold text-paper backdrop-blur transition group-hover:bg-ink">
              Show all {images.length} photos
            </span>
          )}
        </button>
      )}
      {others.map((att) => (
        <a
          key={att.id}
          href={att.url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-black/15 px-3 py-1 font-mono text-xs font-semibold text-accent hover:border-accent"
        >
          {att.label || (att.type === "VIDEO" ? "Watch" : "Link")}
        </a>
      ))}
      {lightboxIndex !== null && (
        <Lightbox images={images} startIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </div>
  );
}
