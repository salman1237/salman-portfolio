"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const links = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#cp", label: "Competitive Programming" },
  { href: "#education", label: "Education" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const toggleButton = (
    <button
      type="button"
      onClick={() => setOpen((o) => !o)}
      aria-expanded={open}
      aria-controls="mobile-nav-panel"
      aria-label={open ? "Close menu" : "Open menu"}
      className="fixed right-6 top-4 z-50 flex h-11 w-11 flex-none flex-col items-center justify-center gap-[5px] md:hidden"
    >
      <span
        className={`h-0.5 w-6 transition-[transform,background-color] duration-300 ${
          open ? "translate-y-[6.5px] rotate-45 bg-paper" : "bg-ink"
        }`}
      />
      <span
        className={`h-0.5 w-6 transition-opacity duration-200 ${
          open ? "opacity-0" : "bg-ink"
        }`}
      />
      <span
        className={`h-0.5 w-6 transition-[transform,background-color] duration-300 ${
          open ? "-translate-y-[6.5px] -rotate-45 bg-paper" : "bg-ink"
        }`}
      />
    </button>
  );

  const panel = (
    <div
      id="mobile-nav-panel"
      inert={!open}
      className={`fixed inset-0 z-40 bg-ink text-paper transition-[clip-path] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        open ? "[clip-path:inset(0_0_0_0)]" : "[clip-path:inset(0_0_100%_0)]"
      }`}
    >
      <nav className="flex h-full flex-col justify-center gap-2 px-8">
        {links.map((l, i) => (
          <a
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className={`font-display text-3xl font-extrabold tracking-tight transition-[opacity,transform] duration-500 ${
              open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
            style={{ transitionDelay: open ? `${100 + i * 60}ms` : "0ms" }}
          >
            {l.label}
          </a>
        ))}
        <a
          href="#contact"
          onClick={() => setOpen(false)}
          className={`mt-6 inline-block w-fit rounded-full border-2 border-accent bg-accent px-5 py-3 text-sm font-bold text-ink transition-[opacity,transform] duration-500 ${
            open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
          style={{ transitionDelay: open ? `${100 + links.length * 60}ms` : "0ms" }}
        >
          Contact
        </a>
      </nav>
    </div>
  );

  return (
    <div className="h-11 w-11 flex-none md:hidden">
      {/* Button and panel are both portaled to document.body so they share
          the root stacking context: the button needs z-50 to beat the
          panel's z-40 even while open, which isn't guaranteed if it stays
          nested inside the sticky nav's own (lower) stacking context. The
          nav's backdrop-blur also establishes a containing block for
          `fixed` descendants in some browsers, which would otherwise break
          the panel's fixed positioning. This div is just a layout
          placeholder reserving the button's space in the nav row. */}
      {mounted && createPortal(toggleButton, document.body)}
      {mounted && createPortal(panel, document.body)}
    </div>
  );
}
