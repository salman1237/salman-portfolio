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
    <div className="mt-3 flex flex-col gap-3">
      {cover && (
        <button
          type="button"
          onClick={() => setLightboxIndex(0)}
          className="group relative aspect-[3/2] w-full max-w-md overflow-hidden rounded-xl border border-black/10 transition hover:border-accent sm:max-w-lg lg:max-w-xl"
        >
          <Image
            src={cover.url}
            alt={cover.label ?? "Attachment"}
            fill
            sizes="(min-width: 1024px) 576px, (min-width: 640px) 512px, 90vw"
            className="object-cover"
          />
          {images.length > 1 && (
            <span className="absolute bottom-3 right-3 rounded-full bg-ink/80 px-3.5 py-2 font-mono text-xs font-semibold text-paper backdrop-blur transition group-hover:bg-ink">
              Show all {images.length} photos
            </span>
          )}
        </button>
      )}
      {others.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
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
        </div>
      )}
      {lightboxIndex !== null && (
        <Lightbox images={images} startIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </div>
  );
}
