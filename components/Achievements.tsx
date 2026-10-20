import { getAchievements } from "@/lib/data";

export default async function Achievements() {
  const teamWins = await getAchievements();
  return (
    <section className="py-20">
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
              <span>{w.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
