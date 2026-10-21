"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

type GalleryImage = { id: number; url: string; label: string | null };

export default function Lightbox({
  images,
  startIndex,
  onClose,
}: {
  images: GalleryImage[];
  startIndex: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(startIndex);
  const touchStartX = useRef<number | null>(null);

  const prev = useCallback(() => setCurrent((c) => (c - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % images.length), [images.length]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > 50) prev();
    else if (delta < -50) next();
    touchStartX.current = null;
  }

  const img = images[current];
  if (!img) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-ink/95 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery"
    >
      <div className="flex items-center justify-between px-4 py-4 text-paper sm:px-6" onClick={(e) => e.stopPropagation()}>
        <span className="font-mono text-sm text-paper/70">
          {current + 1} / {images.length}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-paper/10"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div
        className="relative flex flex-1 items-center justify-center px-2"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {images.length > 1 && (
          <button
            type="button"
            onClick={prev}
            aria-label="Previous image"
            className="absolute left-2 z-10 flex h-10 w-10 flex-none items-center justify-center rounded-full bg-ink/60 text-paper transition hover:bg-ink/80 sm:left-4"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        <div className="relative h-full max-h-[70vh] w-full max-w-4xl">
          <Image
            src={img.url}
            alt={img.label ?? "Attachment"}
            fill
            sizes="(min-width: 768px) 800px, 100vw"
            className="object-contain"
            priority
          />
        </div>

        {images.length > 1 && (
          <button
            type="button"
            onClick={next}
            aria-label="Next image"
            className="absolute right-2 z-10 flex h-10 w-10 flex-none items-center justify-center rounded-full bg-ink/60 text-paper transition hover:bg-ink/80 sm:right-4"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>

      {images.length > 1 && (
        <div
          className="flex gap-2 overflow-x-auto px-4 pb-6 pt-2 sm:justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((im, i) => (
            <button
              key={im.id}
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`View image ${i + 1}`}
              className={`relative h-14 w-14 flex-none overflow-hidden rounded-lg border-2 transition ${
                i === current ? "border-paper" : "border-paper/20 hover:border-paper/50"
              }`}
            >
              <Image src={im.url} alt="" fill sizes="56px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body
  );
}
