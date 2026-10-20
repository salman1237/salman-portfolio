import { getAbout } from "@/lib/data";

export default async function About() {
  const about = await getAbout();
  return (
    <section id="about" className="py-20">
      <div className="mx-auto max-w-wrap px-6 md:px-10">
        <h2 className="max-w-2xl text-balance font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Full-stack builder with a competitive-programming habit.
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          {about.map((p, i) => (
            <p key={i} className="max-w-[62ch] text-base leading-relaxed">
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
