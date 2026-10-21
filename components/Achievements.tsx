import { getAchievements } from "@/lib/data";
import Reveal from "./Reveal";
import AttachmentGallery from "./AttachmentGallery";

export default async function Achievements() {
  const teamWins = await getAchievements();
  return (
    <section id="achievements" className="py-20">
      <div className="mx-auto max-w-wrap px-6 md:px-10">
        <Reveal
          as="h2"
          underline
          className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl"
        >
          Hackathons &amp; contests.
        </Reveal>
        <div className="mt-6 max-w-[72ch]">
          {teamWins.map((w, i) => (
            <Reveal
              key={w.id}
              as="div"
              variant="slide-left"
              delay={i * 70}
              className={`flex gap-4 py-4 text-sm leading-relaxed ${
                i > 0 ? "border-t border-black/10" : ""
              }`}
            >
              <span className="mt-2 h-2 w-2 flex-none rounded-full bg-accent" />
              <div className="flex-1">
                <span>{w.text}</span>
                <AttachmentGallery attachments={w.attachments} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
