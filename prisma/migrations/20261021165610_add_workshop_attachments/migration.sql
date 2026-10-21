-- CreateTable
CREATE TABLE "WorkshopAttachment" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "label" TEXT,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "workshopId" INTEGER NOT NULL,

    CONSTRAINT "WorkshopAttachment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WorkshopAttachment" ADD CONSTRAINT "WorkshopAttachment_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "Workshop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
