// Reference/seed data only. The live site and admin panel now read from
// Postgres via Prisma (see lib/data.ts) — edit content through /admin, not
// here. This file only seeds the database on first run (prisma/seed.ts);
// changing it after that has no effect on the running site.

export const profile = {
  name: "Salman Ahmed",
  role: "Software Engineer · Competitive Programmer",
  tagline:
    "I build production full-stack systems — payments, AI pipelines, computer vision — and ship them end to end, from database schema to deploy.",
  location: "Savar, Dhaka, Bangladesh",
  currently: "Software Engineer at Skoder Technologies, Dhaka",
  studying:
    "B.Sc., Institute of Information Technology, Jahangirnagar University",
  email: "salmanahmed382.jubair@gmail.com",
  phone: "+880 1879246551",
  links: {
    linkedin: "https://www.linkedin.com/in/salman-ahmed-5272851a2/",
    github: "https://github.com/salman1237",
    codeforces: "https://codeforces.com/profile/salman___",
    leetcode: "https://leetcode.com/Salman_2033/",
  },
};

export const about = [
  "I'm a final-year student at Jahangirnagar University, currently working as a Software Engineer at Skoder Technologies, where I build and maintain production FastAPI, Next.js and Laravel applications — RESTful APIs, database migrations, query optimization, and AI automation agents wired up with n8n and LLM workflows.",
  "Outside of work I compete in contests (ICPC, IEEEXtreme, national onsites), train juniors in the IIT competitive-programming community, and ship side projects end to end — payments infrastructure, AI pipelines, computer-vision systems — usually solo, always in production shape.",
];

export const experience = {
  role: "Software Engineer",
  company: "Skoder Technologies, Dhaka, Bangladesh",
  period: "Jul 2025 — Present",
  bullets: [
    "Builds and maintains production-ready FastAPI, Next.js and Laravel applications on MVC architecture and MySQL.",
    "Develops RESTful APIs, manages database migrations, and optimizes queries for performance.",
    "Automates workflows and data-processing tasks with Python scripts.",
    "Designs AI automation agents with n8n, integrating APIs and LLM-based workflows.",
  ],
};

export type Project = {
  name: string;
  tagline: string;
  stack: string;
  dark: boolean;
  links?: { label: string; href: string }[];
  bullets: string[];
};

export const projects: Project[] = [
  {
    name: "Triptel",
    tagline: "Global travel eSIM marketplace — B2C & B2B",
    stack: "FastAPI · Next.js 15 · PostgreSQL",
    dark: false,
    // TODO: add the live site URL
    links: [{ label: "Live site", href: "#" }],
    bullets: [
      "Production eSIM marketplace with async SQLAlchemy + Alembic, integrating a supplier API for real-time provisioning across 130+ countries, with background fulfilment, crash recovery and automatic refunds.",
      "Integrated ShurjoPay (bKash, Nagad, cards) with server-to-server IPN and idempotent callbacks over a double-entry wallet ledger; built finance reconciliation, merchant statements and an SVG admin dashboard.",
      "Designed a B2B Partner API (API key → JWT, idempotent orders, HMAC-signed webhooks) with tiered commission; shipped with Docker and GitHub Actions CI/CD, backed by 235 automated tests.",
    ],
  },
  {
    name: "Opportunity Finder",
    tagline: "AI-based opportunity discovery platform",
    stack: "FastAPI · Next.js 16 · OpenAI API",
    dark: true,
    // TODO: add GitHub repo + live demo URLs
    links: [
      { label: "GitHub", href: "#" },
      { label: "Live demo", href: "#" },
    ],
    bullets: [
      "Automated ingestion engine aggregating opportunities daily from 6 live sources into Neon PostgreSQL with GIN-indexed full-text search and scheduled backfill runs.",
      "OpenAI pipeline parses PDF resumes into structured JSON profiles and matches them against listings, generating 0–100 relevance scores with tailored explanations and JSONB caching.",
      "Full-stack app in FastAPI + Next.js (TypeScript, Tailwind, Framer Motion) with automated daily email digests and deadline alerts.",
    ],
  },
  {
    name: "MosquitoVision",
    tagline: "Epidemiological disease alert system",
    stack: "PyTorch · YOLO26 · OpenCV · FastAPI",
    dark: false,
    // TODO: add live demo + dataset URLs
    links: [
      { label: "Live demo", href: "#" },
      { label: "Dataset", href: "#" },
    ],
    bullets: [
      "Synthesized 5,000 multi-object scenes from 3,000 isolated specimens (U²-Net + OpenCV contouring); trained a custom YOLO26 segmentation model hitting 99.3% Box mAP@50 and 99.0% Mask mAP@50 across Aedes, Anopheles and Culex.",
      "Built a full-stack FastAPI + Next.js surveillance dashboard mapping YOLO detections to automated risk protocols — Critical Malaria, Dengue/Zika alerts — with targeted intervention dispatches.",
    ],
  },
  {
    name: "Khude Khabar",
    tagline: "Bengali AI meal planner for children",
    stack: "Laravel 12 · Alpine.js · WebSockets",
    dark: true,
    // TODO: add GitHub repo + live demo URLs
    links: [
      { label: "GitHub", href: "#" },
      { label: "Live demo", href: "#" },
    ],
    bullets: [
      "Full-stack Laravel 12 MPA with Alpine.js and Tailwind generating personalized, culturally relevant Bengali meal plans for children.",
      "Asynchronous event-driven AI pipeline integrating OpenAI with Laravel queues, with real-time WebSocket updates via Laravel Echo and Pusher.",
      "Automated daily email notifications and visual growth tracking with Chart.js, secured with Laravel Breeze.",
    ],
  },
  {
    name: "KenaBecha JU",
    tagline: "Jahangirnagar University student marketplace",
    stack: "Next.js 16 · FastAPI · PostgreSQL",
    dark: false,
    links: [
      { label: "Live site", href: "https://kenabechaju.com" },
      { label: "GitHub", href: "https://github.com/salman1237/kenabecha-ju" },
      { label: "Android app", href: "https://github.com/salman1237/kenabecha-ju-android" },
    ],
    bullets: [
      "Full-stack campus marketplace for buying/selling used items and running small shops — listings with categories, tags, image galleries, pickup/delivery fulfillment, 30-day expiry with renewal, and admin-curated featured/top promotion.",
      "Real-time chat over WebSockets per listing with typing indicators, read receipts, and image attachments; JWT access + rotating refresh tokens in httpOnly cookies, plus Google Identity Services sign-in.",
      "Fully bilingual (English/Bangla, ~280 translated keys with compile-time key parity), with a role-based admin panel (audit log, bulk moderation, modular landing-page builder) and a native Android client (Kotlin, Jetpack Compose) sharing the same backend.",
    ],
  },
  {
    name: "Blood Connect JU",
    tagline: "Blood donation coordination for Jahangirnagar University",
    stack: "Laravel 12 · Blade · MySQL",
    dark: true,
    links: [
      { label: "Live site", href: "https://bloodconnectju.org" },
      { label: "GitHub", href: "https://github.com/salman1237/blood-connect-ju-laravel" },
      { label: "Android app", href: "https://github.com/salman1237/blood-connect-ju-android" },
    ],
    bullets: [
      "Matches blood requests to donors by real ABO/Rh compatibility (not just exact match), then shared hall/department and availability — compatible donors are notified automatically the moment a matching request goes up.",
      "Two-step trust model: a verifier queue approves requests before they go live, and a donation only logs to history and badges after both the requester and donor independently confirm it actually happened.",
      "Donor engagement via badges, a donation history timeline, and a hall/department leaderboard; bilingual EN/বাংলা, with a native Android client (Kotlin, Jetpack Compose) talking to the same backend over a Sanctum-authenticated API.",
    ],
  },
];

export const skillGroups = [
  {
    category: "Languages",
    items: ["C", "C++", "Java", "Python", "JavaScript", "TypeScript", "PHP", "SQL"],
  },
  { category: "Backend", items: ["FastAPI", "Laravel", "REST APIs", "MVC", "n8n"] },
  {
    category: "Frontend",
    items: ["Next.js", "React", "Tailwind CSS", "Alpine.js", "Framer Motion"],
  },
  {
    category: "AI / ML",
    items: ["OpenAI API", "LLM Integration", "Prompt Engineering", "PyTorch", "YOLO", "OpenCV"],
  },
  {
    category: "Data",
    items: ["MySQL", "PostgreSQL", "JSONB", "GIN Indexing", "Pandas", "NumPy"],
  },
  { category: "Tools", items: ["Git", "Docker", "Linux", "Vercel", "Postman", "Selenium"] },
];

export const cpStats = [
  { platform: "Codeforces", value: "1430", handle: "salman___" },
  { platform: "LeetCode", value: "1699", handle: "Salman_2033" },
  { platform: "CodeChef", value: "1507", handle: "salman2033" },
  { platform: "AtCoder", value: "349", handle: "Salman2033" },
  { platform: "VJudge", value: "546 solved", handle: "salman2033" },
  { platform: "LightOJ", value: "72 solved", handle: "salman_2033" },
];

export const teamWins = [
  "bKash presents SUST CSE Carnival 2026 — Codex Community Hackathon: Top 50 onsite finalist of 700+ teams, Team JU_OneMoreZero",
  "ICPC Dhaka Regional 2025 Onsite — Team JU_Odd_Bits",
  "ICPC Dhaka Preliminary 2024 — Top 10.7% (267 / 2489), Team JU_ErrorMakers",
  "ICPC Dhaka Preliminary 2023 — Top 8.4% (210 / 2479), Team JU_OneMoreZero",
  "JU NCPC Preliminary & Onsite 2023 — Top 12.1%, 167th, Team JU_S3",
  "Breaking Code '23 — 5th place, Team JU_Jabian_1.0",
  "IEEEXtreme 18.0 & 17.0 — 19th & 11th in Bangladesh, Teams JUErrorMakers & JUOneMoreZero",
];

export const leadership = [
  {
    role: "Teaching Assistant, Structured Programming Language Lab",
    place: "Institute of Information Technology, Jahangirnagar University",
    period: "Aug 2026 – Present",
    text: "Guides students through weekly C lab sessions, helps debug code, and evaluates lab assignments.",
  },
  {
    role: "CP Trainer",
    place: "Competitive Programming Community, IIT, Jahangirnagar University",
    period: "Mar 2024 – Present",
    text: "Coordinates contests and teaches graph algorithms, data structures and dynamic programming.",
  },
];

export const education = {
  school: "Jahangirnagar University",
  location: "Savar, Dhaka",
  degree: "B.Sc. in Institute of Information Technology",
  period: "Feb 2022 — Present",
};
