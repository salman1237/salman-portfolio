import { getWorkshops } from "@/lib/data";

export default async function Workshops() {
  const workshops = await getWorkshops();
  if (workshops.length === 0) return null;

  return (
    <section id="workshops" className="bg-paper-dim py-20">
      <div className="mx-auto max-w-wrap px-6 md:px-10">
        <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Workshops.
        </h2>
        <div className="mt-6 max-w-[72ch]">
          {workshops.map((w, i) => (
            <div
              key={w.id}
              className={`flex flex-col gap-1 py-4 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between sm:gap-2 ${
                i > 0 ? "border-t border-black/10" : ""
              }`}
            >
              <div>
                <div className="text-base font-bold">{w.title}</div>
                <div className="text-sm text-muted">{w.organizer}</div>
              </div>
              <div className="font-mono text-xs text-accent tabular">{w.period}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
