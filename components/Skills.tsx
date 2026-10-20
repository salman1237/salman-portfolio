import { getSkillGroups } from "@/lib/data";

export default async function Skills() {
  const skillGroups = await getSkillGroups();
  return (
    <section id="skills" className="bg-ink py-20 text-paper">
      <div className="mx-auto max-w-wrap px-6 md:px-10">
        <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Toolbox.
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((g) => (
            <div key={g.id} className="flex flex-col gap-3">
              <div className="font-mono text-xs text-accent-3">
                {g.category}
              </div>
              <div className="flex flex-wrap gap-2">
                {g.items.map((item) => (
                  <span
                    key={item.id}
                    className="rounded-full border border-paper/20 px-3 py-1.5 font-mono text-xs text-paper"
                  >
                    {item.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
