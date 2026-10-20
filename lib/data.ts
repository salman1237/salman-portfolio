import { prisma } from "@/lib/prisma";

export async function getProfile() {
  const profile = await prisma.profile.findUnique({ where: { id: 1 } });
  if (!profile) throw new Error("Profile row is missing — run `npm run db:seed`.");
  return profile;
}

export async function getAbout() {
  const rows = await prisma.aboutParagraph.findMany({ orderBy: { order: "asc" } });
  return rows.map((r) => r.text);
}

export async function getExperience() {
  return prisma.experience.findMany({
    orderBy: { order: "asc" },
    include: { bullets: { orderBy: { order: "asc" } } },
  });
}

export async function getProjects() {
  return prisma.project.findMany({
    orderBy: { order: "asc" },
    include: {
      bullets: { orderBy: { order: "asc" } },
      links: { orderBy: { order: "asc" } },
    },
  });
}

export async function getSkillGroups() {
  return prisma.skillGroup.findMany({
    orderBy: { order: "asc" },
    include: { items: { orderBy: { order: "asc" } } },
  });
}

export async function getCpStats() {
  return prisma.cpStat.findMany({ orderBy: { order: "asc" } });
}

export async function getAchievements() {
  return prisma.achievement.findMany({ orderBy: { order: "asc" } });
}

export async function getLeadership() {
  return prisma.leadership.findMany({ orderBy: { order: "asc" } });
}

export async function getEducation() {
  const rows = await prisma.education.findMany({ orderBy: { order: "asc" } });
  return rows[0] ?? null;
}
