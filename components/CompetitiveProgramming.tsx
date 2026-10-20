import { getCpStats } from "@/lib/data";

export default async function CompetitiveProgramming() {
  const cpStats = await getCpStats();
  return (
    <section id="cp" className="bg-ink py-20 text-paper">
      <div className="mx-auto max-w-wrap px-6 md:px-10">
        <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Individual ratings, across platforms.
        </h2>
        <div className="mt-9 grid grid-cols-2 border-t border-paper/20 sm:grid-cols-3 lg:grid-cols-6">
          {cpStats.map((s) => (
            <div
              key={s.id}
              className="flex flex-col gap-1 border-b border-r border-paper/20 p-5 [&:nth-child(2n)]:border-r-0 sm:[&:nth-child(2n)]:border-r sm:[&:nth-child(3n)]:border-r-0 lg:[&:nth-child(3n)]:border-r lg:[&:nth-child(6n)]:border-r-0"
            >
              <div className="font-mono text-xs text-paper/70">{s.platform}</div>
              <div className="font-display text-3xl font-extrabold tracking-tight tabular">
                {s.value}
              </div>
              <div className="font-mono text-[0.7rem] text-accent-3">
                {s.handle}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
