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

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      {images.map((att, i) => (
        <button
          key={att.id}
          type="button"
          onClick={() => setLightboxIndex(i)}
          className="relative h-28 w-44 overflow-hidden rounded-lg border border-black/10 transition hover:border-accent"
        >
          <Image src={att.url} alt={att.label ?? "Attachment"} fill sizes="176px" className="object-cover" />
        </button>
      ))}
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
