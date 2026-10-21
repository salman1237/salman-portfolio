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
    let saved: string | null;
    try {
      saved = sessionStorage.getItem(KEY);
      if (saved !== null) sessionStorage.removeItem(KEY);
    } catch {
      saved = null;
    }
    if (saved === null) return;
    const y = Number(saved);

    // The page is often still short right after navigation — content
    // (especially images, like project cover photos) is still loading in,
    // so an immediate scrollTo gets silently clamped to whatever height
    // exists at that instant. Re-attempt whenever the document's height
    // actually changes, rather than guessing at a fixed delay, so this
    // works whether the content settles in 50ms or 2s.
    let settled = false;
    const tryScroll = (src: string) => {
      window.scrollTo(0, y);
      console.log(`[ScrollRestore] tryScroll(${src}) target=${y} docHeight=${document.documentElement.scrollHeight} resultScrollY=${window.scrollY}`);
      if (window.scrollY >= y - 2) settled = true;
    };

    tryScroll("initial");
    const observer = new ResizeObserver(() => {
      if (!settled) tryScroll("resize");
    });
    observer.observe(document.documentElement);

    // Also log scroll events to see if something else is moving us
    const scrollListener = () => console.log("[ScrollRestore] window scroll event, scrollY=", window.scrollY);
    window.addEventListener("scroll", scrollListener);

    // Belt-and-suspenders cutoff in case height never reaches the target
    // (e.g. an item was deleted and is shorter than before).
    const timeout = setTimeout(() => {
      observer.disconnect();
      window.removeEventListener("scroll", scrollListener);
    }, 4000);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [pathname, searchParams]);

  return null;
}
