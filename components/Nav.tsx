import MobileNav from "./MobileNav";

const links = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#cp", label: "Competitive Programming" },
  { href: "#achievements", label: "Achievements" },
  { href: "#workshops", label: "Workshops" },
  { href: "#education", label: "Education" },
];

export default function Nav() {
  return (
    <nav className="sticky top-0 z-20 border-b border-black/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-wrap flex-wrap items-center justify-between gap-4 px-6 py-4 md:px-10">
        <span className="font-display text-base font-extrabold tracking-tight">
          Salman Ahmed
        </span>
        <div className="hidden flex-wrap gap-6 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group relative text-sm font-semibold text-ink"
            >
              {l.label}
              <span className="absolute inset-x-0 -bottom-1 h-[1.5px] origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
        </div>
        <a
          href="#contact"
          className="hidden rounded-full border-2 border-ink bg-accent px-4 py-2 text-sm font-bold text-ink transition hover:bg-ink hover:text-paper md:inline-block"
        >
          Contact
        </a>
        <MobileNav />
      </div>
    </nav>
  );
}
