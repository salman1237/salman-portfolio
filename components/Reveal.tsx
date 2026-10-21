"use client";

import { useEffect, useRef, useState } from "react";
import type { ElementType, ReactNode } from "react";

type Variant = "rise" | "scale" | "slide-left" | "slide-right" | "mask";

export default function Reveal({
  children,
  variant = "rise",
  delay = 0,
  className = "",
  as,
  underline = false,
}: {
  children: ReactNode;
  variant?: Variant;
  delay?: number;
  className?: string;
  as?: ElementType;
  underline?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const Tag = (as ?? "div") as ElementType;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const classes = [
    "reveal",
    `reveal-${variant}`,
    underline ? "heading-underline" : "",
    visible ? "is-visible" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag ref={ref} className={classes} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  );
}
