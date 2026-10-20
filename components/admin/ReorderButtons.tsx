"use client";

import { useTransition } from "react";

export default function ReorderButtons({
  id,
  disableUp,
  disableDown,
  reorder,
}: {
  id: number;
  disableUp: boolean;
  disableDown: boolean;
  reorder: (id: number, direction: "up" | "down") => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="order-first flex flex-none flex-col gap-1">
      <button
        type="button"
        aria-label="Move up"
        disabled={disableUp || pending}
        onClick={() => startTransition(() => reorder(id, "up"))}
        className="flex h-11 w-11 items-center justify-center rounded-lg border border-black/15 text-base disabled:opacity-30"
      >
        ↑
      </button>
      <button
        type="button"
        aria-label="Move down"
        disabled={disableDown || pending}
        onClick={() => startTransition(() => reorder(id, "down"))}
        className="flex h-11 w-11 items-center justify-center rounded-lg border border-black/15 text-base disabled:opacity-30"
      >
        ↓
      </button>
    </div>
  );
}
