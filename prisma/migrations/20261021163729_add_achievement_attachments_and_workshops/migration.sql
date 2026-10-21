-- CreateTable
CREATE TABLE "AchievementAttachment" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "label" TEXT,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "achievementId" INTEGER NOT NULL,

    CONSTRAINT "AchievementAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workshop" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "organizer" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Workshop_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AchievementAttachment" ADD CONSTRAINT "AchievementAttachment_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "Achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
