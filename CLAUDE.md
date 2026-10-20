# Salman Ahmed — Portfolio

Next.js 15 (App Router) + TypeScript + Tailwind. Single scrolling page, one component per section.

## Where things live

- **All copy and facts** (resume content, project descriptions, stats, links) live in `data/content.ts`. This is the only place to edit text — components just render it. Keep it resume-accurate; don't invent numbers or links.
- **Design tokens** are in `tailwind.config.ts` (`ink`, `paper`, `paper-dim`, `accent`, `accent-2`, `accent-3`, `muted`) and fonts in `app/layout.tsx` (Bricolage Grotesque / Manrope / Space Mono via `next/font/google`). Treat these as the committed palette — don't introduce new ad-hoc colors without a reason.
- **Sections** are one component each in `components/`, assembled in `app/page.tsx`.

## Open TODOs in the content

`data/content.ts` has a few placeholder links marked `// TODO`: GitHub username, and live-site/repo/demo links for each project. Fill these in as they're confirmed — don't guess a URL.

## Working on this project

- Use the **frontend-design** skill (`.claude/skills/frontend-design/`) for any new section, restyle, or layout decision — it has the full design process and the list of "looks like AI generated this" tells to avoid.
- After a visual change, run the **design-reviewer** subagent to critique it against that skill before considering it done.
- Keep components server components by default; only mark `"use client"` where there's actual interactivity (see `components/Contact.tsx` for the pattern — clipboard copy with a fallback).
- `npm run dev` to preview, `npm run build` to check it compiles cleanly before a deploy.

## Deploying

No deploy target is wired up yet. Vercel is the natural fit for a Next.js app — ask before setting up a new account or connecting one.
