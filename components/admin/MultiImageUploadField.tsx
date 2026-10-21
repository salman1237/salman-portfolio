"use client";

import { useRef, useState } from "react";

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

type Item = {
  key: string;
  preview: string;
  url: string | null;
  uploading: boolean;
  error: string | null;
};

/** Like ImageUploadField, but lets the user pick/drop several images at
 * once. Each file uploads independently via the same upload API; the
 * resulting URLs are emitted as repeated hidden inputs under `name`, so the
 * server action reads them with `formData.getAll(name)` and creates one
 * attachment row per image. */
export default function MultiImageUploadField({
  name,
  label,
}: {
  name: string;
  label: string;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  async function addFiles(files: FileList | File[]) {
    for (const file of Array.from(files)) {
      const key = `${file.name}-${file.size}-${Date.now()}-${Math.random()}`;

      if (!ACCEPTED.includes(file.type)) {
        setItems((prev) => [...prev, { key, preview: "", url: null, uploading: false, error: "Unsupported type" }]);
        continue;
      }
      if (file.size > MAX_BYTES) {
        setItems((prev) => [...prev, { key, preview: "", url: null, uploading: false, error: "Over 5MB" }]);
        continue;
      }

      const preview = URL.createObjectURL(file);
      setItems((prev) => [...prev, { key, preview, url: null, uploading: true, error: null }]);

      try {
        const body = new FormData();
        body.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Upload failed.");
        setItems((prev) => prev.map((it) => (it.key === key ? { ...it, url: json.url, uploading: false } : it)));
      } catch (err) {
        setItems((prev) =>
          prev.map((it) =>
            it.key === key
              ? { ...it, uploading: false, error: err instanceof Error ? err.message : "Upload failed." }
              : it
          )
        );
      }
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) addFiles(e.target.files);
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  }

  function removeItem(key: string) {
    setItems((prev) => prev.filter((it) => it.key !== key));
  }

  const anyUploading = items.some((it) => it.uploading);

  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-xs text-ink/70">{label}</span>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`relative flex min-h-[88px] w-full max-w-sm flex-wrap items-center gap-2 rounded-lg border-2 border-dashed bg-paper-dim p-2 ${
          dragOver ? "border-accent" : "border-black/15"
        }`}
      >
        {items.map((it) => (
          <div key={it.key} className="relative h-16 w-16 flex-none overflow-hidden rounded border border-black/10 bg-white">
            {it.preview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={it.preview} alt="" className="h-full w-full object-cover" />
            )}
            {it.uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-ink/40 text-[0.6rem] font-semibold text-paper">
                …
              </div>
            )}
            {it.error && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-600/85 p-1 text-center text-[0.55rem] font-semibold leading-tight text-white">
                {it.error}
              </div>
            )}
            <button
              type="button"
              onClick={() => removeItem(it.key)}
              className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-ink/70 text-[0.65rem] leading-none text-paper"
              aria-label="Remove image"
            >
              ×
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <span className="px-2 text-center text-sm text-ink/60">
            Drag images here, or tap to choose — pick several at once
          </span>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(",")}
          multiple
          onChange={onInputChange}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          style={{ display: items.length === 0 ? "block" : "none" }}
          aria-label={label}
        />
      </div>
      {items.length > 0 && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="self-start text-sm font-semibold text-ink/70 underline-offset-4 hover:text-accent hover:underline"
        >
          Add more
        </button>
      )}
      {anyUploading && <p className="text-sm text-ink/60">Uploading…</p>}
      {items
        .filter((it) => it.url)
        .map((it) => (
          <input key={it.key} type="hidden" name={name} value={it.url!} />
        ))}
    </div>
  );
}
