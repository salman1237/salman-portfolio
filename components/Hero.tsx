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
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex h-[46px] w-[46px] items-center justify-center rounded-full border-2 border-paper/30 text-paper transition hover:border-paper hover:bg-paper hover:text-ink"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                  <path d="M12 .5C5.73.5.98 5.24.98 11.52c0 4.84 3.14 8.95 7.49 10.4.55.1.75-.24.75-.53 0-.26-.01-1.13-.02-2.05-3.05.66-3.69-1.3-3.69-1.3-.5-1.26-1.21-1.6-1.21-1.6-.99-.68.07-.66.07-.66 1.1.08 1.67 1.13 1.67 1.13.97 1.67 2.55 1.19 3.17.91.1-.71.38-1.19.69-1.47-2.44-.28-5-1.22-5-5.43 0-1.2.43-2.18 1.13-2.95-.11-.28-.49-1.4.11-2.92 0 0 .92-.3 3.02 1.12a10.5 10.5 0 0 1 5.5 0c2.1-1.42 3.02-1.12 3.02-1.12.6 1.52.22 2.64.11 2.92.7.77 1.13 1.75 1.13 2.95 0 4.22-2.57 5.15-5.02 5.42.39.34.74 1.01.74 2.03 0 1.47-.01 2.65-.01 3.01 0 .29.2.64.76.53 4.35-1.45 7.48-5.56 7.48-10.4C23.02 5.24 18.27.5 12 .5Z" />
                </svg>
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
