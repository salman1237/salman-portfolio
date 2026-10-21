"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const KEY = "admin-scroll-y";

/** Mounted once in the admin layout. Every create/update/delete action
 * redirects (full navigation), which resets scroll to the top by default —
 * disorienting on long pages with many rows. This records scroll position
 * right before any submit-button click and restores it after the resulting
 * navigation lands, so Save/Delete/Add keep you where you were. */
export default function ScrollRestore() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = (e.target as HTMLElement)?.closest('button[type="submit"]');
      if (target) {
        try {
          sessionStorage.setItem(KEY, String(window.scrollY));
        } catch {
          // storage unavailable — scroll just won't be restored, non-fatal
        }
      }
    }
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(KEY);
      if (saved !== null) {
        sessionStorage.removeItem(KEY);
        const y = Number(saved);
        // The page is often still short right after navigation (content
        // still streaming in), so an immediate scrollTo gets silently
        // clamped. Retry for a bit as the layout settles.
        let attempts = 0;
        const tryScroll = () => {
          window.scrollTo(0, y);
          attempts += 1;
          if (window.scrollY < y - 2 && attempts < 10) {
            setTimeout(tryScroll, 50);
          }
        };
        requestAnimationFrame(tryScroll);
      }
    } catch {
      // storage unavailable — nothing to restore
    }
  }, [pathname, searchParams]);

  return null;
}
