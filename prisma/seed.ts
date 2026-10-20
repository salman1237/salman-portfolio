import { PrismaClient } from "@prisma/client";
import {
  profile,
  about,
  experience,
  projects,
  skillGroups,
  cpStats,
  teamWins,
  leadership,
  education,
} from "../data/content";

const prisma = new PrismaClient();

async function main() {
  await prisma.profile.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      name: profile.name,
      role: profile.role,
      tagline: profile.tagline,
      location: profile.location,
      currently: profile.currently,
      studying: profile.studying,
      email: profile.email,
      phone: profile.phone,
      linkedin: profile.links.linkedin,
      github: profile.links.github,
      codeforces: profile.links.codeforces,
      leetcode: profile.links.leetcode,
    },
    update: {},
  });

  if ((await prisma.aboutParagraph.count()) === 0) {
    await prisma.aboutParagraph.createMany({
      data: about.map((text, i) => ({ text, order: i })),
    });
  }

  if ((await prisma.experience.count()) === 0) {
    await prisma.experience.create({
      data: {
        role: experience.role,
        company: experience.company,
        period: experience.period,
        order: 0,
        bullets: {
          create: experience.bullets.map((text, i) => ({ text, order: i })),
        },
      },
    });
  }

  if ((await prisma.project.count()) === 0) {
    for (const [i, p] of projects.entries()) {
      await prisma.project.create({
        data: {
          name: p.name,
          tagline: p.tagline,
          stack: p.stack,
          dark: p.dark,
          order: i,
          bullets: { create: p.bullets.map((text, j) => ({ text, order: j })) },
          links: {
            create: (p.links ?? []).map((l, j) => ({
              label: l.label,
              href: l.href,
              order: j,
            })),
          },
        },
      });
    }
  }

  if ((await prisma.skillGroup.count()) === 0) {
    for (const [i, g] of skillGroups.entries()) {
      await prisma.skillGroup.create({
        data: {
          category: g.category,
          order: i,
          items: { create: g.items.map((name, j) => ({ name, order: j })) },
        },
      });
    }
  }

  if ((await prisma.cpStat.count()) === 0) {
    await prisma.cpStat.createMany({
      data: cpStats.map((s, i) => ({ ...s, order: i })),
    });
  }

  if ((await prisma.achievement.count()) === 0) {
    await prisma.achievement.createMany({
      data: teamWins.map((text, i) => ({ text, order: i })),
    });
  }

  if ((await prisma.leadership.count()) === 0) {
    await prisma.leadership.createMany({
      data: leadership.map((l, i) => ({ ...l, order: i })),
    });
  }

  if ((await prisma.education.count()) === 0) {
    await prisma.education.create({ data: { ...education, order: 0 } });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
