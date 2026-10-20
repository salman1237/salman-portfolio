import { getExperience } from "@/lib/data";

export default async function Experience() {
  const experience = await getExperience();
  return (
    <section className="bg-paper-dim py-20">
      <div className="mx-auto max-w-wrap px-6 md:px-10">
        <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Experience.
        </h2>
        <div className="mt-6 flex flex-col gap-5">
          {experience.map((e) => (
            <div
              key={e.id}
              className="rounded-[18px] border-[1.5px] border-ink bg-paper p-7"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <div className="font-display text-xl font-extrabold sm:text-2xl">
                    {e.role}
                  </div>
                  <div className="mt-1 text-muted">{e.company}</div>
                </div>
                <div className="font-mono text-sm text-accent tabular">
                  {e.period}
                </div>
              </div>
              <ul className="mt-5 flex flex-col gap-2.5">
                {e.bullets.map((b) => (
                  <li key={b.id} className="relative pl-5 text-sm leading-relaxed">
                    <span className="absolute left-0 top-2 h-1.5 w-1.5 rounded-full bg-ink/50" />
                    {b.text}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
