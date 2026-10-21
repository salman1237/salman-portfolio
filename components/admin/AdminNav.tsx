"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sections = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/profile", label: "Profile & About" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/cp-stats", label: "CP Stats" },
  { href: "/admin/achievements", label: "Achievements" },
  { href: "/admin/workshops", label: "Workshops" },
  { href: "/admin/leadership", label: "Leadership" },
  { href: "/admin/education", label: "Education" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto px-5 pb-3 md:flex-col md:overflow-visible">
      {sections.map((s) => {
        const active = pathname === s.href;
        return (
          <Link
            key={s.href}
            href={s.href}
            aria-current={active ? "page" : undefined}
            className={`whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
              active ? "bg-paper/10 text-paper" : "text-paper/80 hover:bg-paper/10 hover:text-paper"
            }`}
          >
            {s.label}
          </Link>
        );
      })}
    </nav>
  );
}
