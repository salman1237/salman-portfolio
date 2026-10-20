"use client";

import { buttonDanger } from "@/lib/admin-ui";

export default function ConfirmSubmitButton({
  confirmText,
  children,
  className,
}: {
  confirmText: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="submit"
      className={className ?? buttonDanger}
      onClick={(e) => {
        if (!window.confirm(confirmText)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
