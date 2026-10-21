import { getLeadership, getEducation } from "@/lib/data";

export default async function LeadershipEducation() {
  const [leadership, education] = await Promise.all([
    getLeadership(),
    getEducation(),
  ]);
  return (
    <section id="education" className="bg-paper-dim py-20">
      <div className="mx-auto grid max-w-wrap grid-cols-1 gap-12 px-6 md:grid-cols-2 md:px-10">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            Leadership.
          </h2>
          <div className="mt-5">
            {leadership.map((l, i) => (
              <div
                key={l.id}
                className={`flex flex-col gap-1 py-5 ${
                  i > 0 ? "border-t border-black/10" : ""
                }`}
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between sm:gap-2">
                  <div className="text-base font-bold">{l.role}</div>
                  <div className="font-mono text-xs text-accent tabular">
                    {l.period}
                  </div>
                </div>
                <div className="text-sm text-muted">{l.place}</div>
                <p className="mt-1.5 text-sm leading-relaxed">{l.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            Education.
          </h2>
          {education && (
            <div className="mt-5 rounded-[18px] border-[1.5px] border-black/10 bg-paper p-7">
              <div className="font-display text-xl font-extrabold">
                {education.school}
              </div>
              <div className="mt-1 text-muted">{education.location}</div>
              <div className="mt-3.5 font-semibold">{education.degree}</div>
              <div className="mt-1.5 font-mono text-sm text-accent tabular">
                {education.period}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
