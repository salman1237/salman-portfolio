import Link from "next/link";

const sections = [
  { href: "/admin/profile", label: "Profile & About", desc: "Name, role, bio, contact links, photo" },
  { href: "/admin/experience", label: "Experience", desc: "Jobs and their bullet points" },
  { href: "/admin/projects", label: "Projects", desc: "Project cards, bullets, links, cover images" },
  { href: "/admin/skills", label: "Skills", desc: "Skill groups and tags" },
  { href: "/admin/cp-stats", label: "CP Stats", desc: "Competitive programming ratings" },
  { href: "/admin/achievements", label: "Achievements", desc: "Team wins and hackathon results" },
  { href: "/admin/leadership", label: "Leadership", desc: "Leadership and training roles" },
  { href: "/admin/education", label: "Education", desc: "School and degree" },
];

export default function AdminHome() {
  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold tracking-tight">
        Content.
      </h1>
      <p className="mt-2 max-w-md text-sm text-ink/70">
        Everything here is live on the site immediately after you save.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="rounded-[16px] border-[1.5px] border-black/10 bg-white p-5 transition hover:border-accent"
          >
            <div className="font-display text-lg font-extrabold">{s.label}</div>
            <div className="mt-1 text-sm text-ink/70">{s.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
