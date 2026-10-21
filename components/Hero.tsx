import Image from "next/image";
import { getProfile } from "@/lib/data";

export default async function Hero() {
  const profile = await getProfile();
  const [firstName, ...rest] = profile.name.split(" ");
  return (
    <header className="bg-ink pb-20 pt-24 text-paper">
      <div className="mx-auto max-w-wrap px-6 md:px-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xl">
            <div className="eyebrow eyebrow-dark hero-anim" style={{ animationDelay: "0ms" }}>
              {profile.role}
            </div>
            <h1 className="mt-4 font-display text-[2.8rem] font-extrabold leading-[0.98] tracking-tight text-balance sm:text-6xl lg:text-[5.4rem]">
              <span className="hero-line" style={{ animationDelay: "90ms" }}>
                {firstName}
              </span>
              <br />
              <span className="hero-line" style={{ animationDelay: "220ms" }}>
                {rest.join(" ")}
              </span>
            </h1>
            <p
              className="mt-7 max-w-md text-lg leading-relaxed text-paper/90 hero-anim sm:text-xl"
              style={{ animationDelay: "420ms" }}
            >
              {profile.tagline}
            </p>
            <div className="mt-9 flex flex-wrap gap-4 hero-anim" style={{ animationDelay: "540ms" }}>
              <a
                href="#projects"
                className="rounded-full border-2 border-accent bg-accent px-5 py-3 text-sm font-bold text-ink transition hover:-translate-y-0.5 hover:border-ink hover:bg-ink hover:text-paper"
              >
                See the work
              </a>
              <a
                href="#contact"
                className="rounded-full border-2 border-paper px-5 py-3 text-sm font-bold text-paper transition hover:bg-paper hover:text-ink"
              >
                Get in touch
              </a>
            </div>
          </div>

          {profile.photoUrl && (
            <div
              className="relative mx-auto hero-anim lg:mx-0 lg:flex-none"
              style={{ animationDelay: "280ms" }}
            >
              <div className="absolute -inset-3 -z-10 rotate-3 rounded-[28px] border-2 border-accent/40 sm:-inset-4" />
              <div className="group relative h-60 w-60 overflow-hidden rounded-[24px] border-2 border-accent shadow-[0_24px_60px_-18px_rgba(0,0,0,0.6)] transition-transform duration-500 hover:-rotate-2 sm:h-72 sm:w-72 lg:h-80 lg:w-80 xl:h-[22rem] xl:w-[22rem]">
                <Image
                  src={profile.photoUrl}
                  alt={profile.name}
                  fill
                  sizes="(min-width: 1024px) 352px, (min-width: 640px) 288px, 240px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              </div>
            </div>
          )}
        </div>

        <div
          className="mt-14 grid grid-cols-1 gap-6 hero-anim sm:grid-cols-3"
          style={{ animationDelay: "660ms" }}
        >
          <div>
            <div className="font-mono text-xs text-paper/60">Currently</div>
            <div className="mt-1.5 text-sm">{profile.currently}</div>
          </div>
          <div>
            <div className="font-mono text-xs text-paper/60">Based in</div>
            <div className="mt-1.5 text-sm">{profile.location}</div>
          </div>
          <div>
            <div className="font-mono text-xs text-paper/60">Studying</div>
            <div className="mt-1.5 text-sm">{profile.studying}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
