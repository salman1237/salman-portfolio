import Image from "next/image";
import { getWorkshops } from "@/lib/data";
import Reveal from "./Reveal";

export default async function Workshops() {
  const workshops = await getWorkshops();
  if (workshops.length === 0) return null;

  return (
    <section id="workshops" className="bg-paper-dim py-20">
      <div className="mx-auto max-w-wrap px-6 md:px-10">
        <Reveal
          as="h2"
          underline
          className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl"
        >
          Workshops.
        </Reveal>
        <div className="mt-6 max-w-[72ch]">
          {workshops.map((w, i) => (
            <Reveal
              key={w.id}
              as="div"
              variant="scale"
              delay={i * 90}
              className={`flex flex-col gap-1 py-4 ${i > 0 ? "border-t border-black/10" : ""}`}
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between sm:gap-2">
                <div>
                  <div className="text-base font-bold">{w.title}</div>
                  <div className="text-sm text-muted">{w.organizer}</div>
                </div>
                <div className="font-mono text-xs text-accent tabular">{w.period}</div>
              </div>
              {w.attachments.length > 0 && (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {w.attachments.map((att) =>
                    att.type === "IMAGE" ? (
                      <a
                        key={att.id}
                        href={att.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative h-28 w-44 overflow-hidden rounded-lg border border-black/10 transition hover:border-accent"
                      >
                        <Image src={att.url} alt={att.label ?? "Attachment"} fill sizes="176px" className="object-cover" />
                      </a>
                    ) : (
                      <a
                        key={att.id}
                        href={att.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-black/15 px-3 py-1 font-mono text-xs font-semibold text-accent hover:border-accent"
                      >
                        {att.label || (att.type === "VIDEO" ? "Watch" : "Link")}
                      </a>
                    )
                  )}
                </div>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
