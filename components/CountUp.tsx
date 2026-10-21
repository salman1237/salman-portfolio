"use client";

import { useEffect, useRef, useState } from "react";

/** Animates a numeric value counting up when scrolled into view. Values
 * that aren't purely numeric (e.g. "546 solved") count up the leading
 * number and keep the trailing text static. */
export default function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState<string>(value);
  const hasNumber = /^\d+/.test(value);

  useEffect(() => {
    const el = ref.current;
    const match = value.match(/^(\d+)(.*)$/);
    if (!el || !match) return;
    const target = parseInt(match[1], 10);
    const suffix = match[2];

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setDisplay(value);
      return;
    }

    // Reset to 0 right after hydration (the SSR/no-JS fallback keeps the
    // real value until here) so the count-up has somewhere to animate from
    // once this scrolls into view.
    setDisplay(`0${suffix}`);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const duration = 900;
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(`${Math.round(target * eased)}${suffix}`);
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref} className="tabular">
      {hasNumber ? display : value}
    </span>
  );
}
