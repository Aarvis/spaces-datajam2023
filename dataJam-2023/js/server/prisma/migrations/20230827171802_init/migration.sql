/*
  Warnings:

  - You are about to drop the `Events` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Auction" DROP CONSTRAINT "Auction_sponsorId_fkey";

-- AlterTable
ALTER TABLE "Auction" ALTER COLUMN "sponsorId" DROP NOT NULL;

-- DropTable
DROP TABLE "Events";

-- CreateTable
CREATE TABLE "TournametEvent" (
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "averageViewsAchieved" INTEGER NOT NULL,
    "averageConcurrentViewersOfStream" INTEGER NOT NULL,

    CONSTRAINT "TournametEvent_pkey" PRIMARY KEY ("eventId")
);

-- CreateIndex
CREATE UNIQUE INDEX "TournametEvent_eventId_key" ON "TournametEvent"("eventId");

-- AddForeignKey
ALTER TABLE "Auction" ADD CONSTRAINT "Auction_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "Sponsor"("sponsorId") ON DELETE SET NULL ON UPDATE CASCADE;
