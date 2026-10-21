import Image from "next/image";
import { getProjects } from "@/lib/data";
import Reveal from "./Reveal";

export default async function Projects() {
  const projects = await getProjects();
  return (
    <section id="projects" className="py-20">
      <div className="mx-auto max-w-wrap px-6 md:px-10">
        <Reveal
          as="h2"
          underline
          className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl"
        >
          Builds, shipped to production.
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal
              key={p.id}
              as="article"
              delay={i * 110}
              className={`flex flex-col gap-4 rounded-[20px] border-[1.5px] p-8 ${
                p.dark
                  ? "border-ink bg-ink text-paper"
                  : "border-black/10 bg-paper"
              }`}
            >
              {p.coverImageUrl && (
                <div className="relative -mx-8 -mt-8 aspect-[4/3] overflow-hidden rounded-t-[20px] sm:aspect-[16/9]">
                  <Image
                    src={p.coverImageUrl}
                    alt={`${p.name} preview`}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <h3 className="font-display text-2xl font-extrabold tracking-tight">
                  {p.name}
                </h3>
                <p
                  className={`mt-1 text-base ${
                    p.dark ? "text-paper/70" : "text-muted"
                  }`}
                >
                  {p.tagline}
                </p>
              </div>

              <div
                className={`font-mono text-xs tracking-wide ${
                  p.dark ? "text-accent-3" : "text-accent"
                }`}
              >
                {p.stack}
              </div>

              <ul className="flex flex-col gap-2.5">
                {p.bullets.map((b) => (
                  <li key={b.id} className="relative pl-5 text-sm leading-relaxed">
                    <span className="absolute left-0 top-2 h-1.5 w-1.5 rounded-full bg-current opacity-50" />
                    {b.text}
                  </li>
                ))}
              </ul>

              {p.links.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-4 pt-1">
                  {p.links.map((l) => (
                    <a
                      key={l.id}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-sm font-bold underline-offset-4 ${
                        p.dark ? "text-accent-3" : "text-accent"
                      } hover:underline`}
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
