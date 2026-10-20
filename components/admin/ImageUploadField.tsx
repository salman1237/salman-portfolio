"use client";

import { useRef, useState } from "react";

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export default function ImageUploadField({
  name,
  removeFieldName,
  label,
  currentUrl,
  aspect = "aspect-[16/9]",
}: {
  name: string;
  removeFieldName: string;
  label: string;
  currentUrl: string | null;
  aspect?: string;
}) {
  const [preview, setPreview] = useState<string | null>(currentUrl);
  const [removed, setRemoved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  function acceptFile(file: File) {
    if (!ACCEPTED.includes(file.type)) {
      setError("Use a JPEG, PNG, WebP, or GIF image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("That file is over 5MB.");
      return;
    }
    setError(null);
    setRemoved(false);
    setPreview(URL.createObjectURL(file));
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) acceptFile(file);
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (inputRef.current) {
      const dt = new DataTransfer();
      dt.items.add(file);
      inputRef.current.files = dt.files;
    }
    acceptFile(file);
  }

  function clearImage() {
    setPreview(null);
    setRemoved(true);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-xs text-ink/70">{label}</span>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`relative flex ${aspect} w-full max-w-sm items-center justify-center overflow-hidden rounded-lg border-2 border-dashed bg-paper-dim ${
          dragOver ? "border-accent" : "border-black/15"
        }`}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="px-4 text-center text-sm text-ink/60">
            Drag an image here, or tap to choose one
          </span>
        )}
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept={ACCEPTED.join(",")}
          onChange={onInputChange}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          aria-label={label}
        />
      </div>
      {error && <p className="text-sm font-semibold text-accent">{error}</p>}
      {preview && (
        <button
          type="button"
          onClick={clearImage}
          className="min-h-[44px] self-start text-sm font-semibold text-ink/70 underline-offset-4 hover:text-accent hover:underline"
        >
          Remove image
        </button>
      )}
      <input type="hidden" name={removeFieldName} value={removed ? "1" : ""} />
    </div>
  );
}
