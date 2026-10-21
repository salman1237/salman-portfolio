import { getCpStats } from "@/lib/data";
import Reveal from "./Reveal";
import CountUp from "./CountUp";

export default async function CompetitiveProgramming() {
  const cpStats = await getCpStats();
  return (
    <section id="cp" className="bg-ink py-20 text-paper">
      <div className="mx-auto max-w-wrap px-6 md:px-10">
        <Reveal
          as="h2"
          underline
          className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl"
        >
          Individual ratings, across platforms.
        </Reveal>
        <div className="mt-9 grid grid-cols-2 border-t border-paper/20 sm:grid-cols-3 lg:grid-cols-6">
          {cpStats.map((s, i) => (
            <Reveal
              key={s.id}
              as="div"
              delay={i * 70}
              className="flex flex-col gap-1 border-b border-r border-paper/20 p-5 [&:nth-child(2n)]:border-r-0 sm:[&:nth-child(2n)]:border-r sm:[&:nth-child(3n)]:border-r-0 lg:[&:nth-child(3n)]:border-r lg:[&:nth-child(6n)]:border-r-0"
            >
              <div className="font-mono text-xs text-paper/70">{s.platform}</div>
              <div className="font-display text-3xl font-extrabold tracking-tight">
                <CountUp value={s.value} />
              </div>
              {s.url ? (
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[0.7rem] text-accent-3 underline-offset-2 hover:underline"
                >
                  {s.handle}
                </a>
              ) : (
                <div className="font-mono text-[0.7rem] text-accent-3">
                  {s.handle}
                </div>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
