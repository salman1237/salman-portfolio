import Image from "next/image";
import { getAchievements } from "@/lib/data";

export default async function Achievements() {
  const teamWins = await getAchievements();
  return (
    <section id="achievements" className="py-20">
      <div className="mx-auto max-w-wrap px-6 md:px-10">
        <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Hackathons &amp; contests.
        </h2>
        <div className="mt-6 max-w-[72ch]">
          {teamWins.map((w, i) => (
            <div
              key={w.id}
              className={`flex gap-4 py-4 text-sm leading-relaxed ${
                i > 0 ? "border-t border-black/10" : ""
              }`}
            >
              <span className="mt-2 h-2 w-2 flex-none rounded-full bg-accent" />
              <div className="flex-1">
                <span>{w.text}</span>
                {w.attachments.length > 0 && (
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {w.attachments.map((att) =>
                      att.type === "IMAGE" ? (
                        <a
                          key={att.id}
                          href={att.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative h-12 w-12 overflow-hidden rounded-lg border border-black/10"
                        >
                          <Image src={att.url} alt={att.label ?? "Attachment"} fill sizes="48px" className="object-cover" />
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
