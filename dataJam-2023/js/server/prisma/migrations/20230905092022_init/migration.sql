/*
  Warnings:

  - A unique constraint covering the columns `[sponsorTenureStatsId]` on the table `Auction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Auction" ADD COLUMN     "sponsorTenureStatsId" TEXT;

-- CreateTable
CREATE TABLE "SponsorTenureStats" (
    "sponsorTenureStatsId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "numberOfMatches" INTEGER NOT NULL DEFAULT 0,
    "numberOfRounds" INTEGER NOT NULL DEFAULT 0,
    "kills" INTEGER NOT NULL DEFAULT 0,
    "deaths" INTEGER NOT NULL DEFAULT 0,
    "killAssistsReceived" INTEGER NOT NULL DEFAULT 0,
    "killAssistsGiven" INTEGER NOT NULL DEFAULT 0,
    "selfKills" INTEGER NOT NULL DEFAULT 0,
    "headshots" INTEGER NOT NULL DEFAULT 0,
    "overallViewTime" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tournamentViewTime" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "overallRoundEstimatedViewTime" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "overallMomentsViewTime" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "overallPercentageOfOpponentTeamKilled" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "overallRoundViewPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "overallDamageDealt" INTEGER NOT NULL DEFAULT 0,
    "overallDamageTaken" INTEGER NOT NULL DEFAULT 0,
    "weaponKills" JSONB,
    "overallAce" INTEGER NOT NULL DEFAULT 0,
    "overallClutch" INTEGER NOT NULL DEFAULT 0,
    "teamId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,

    CONSTRAINT "SponsorTenureStats_pkey" PRIMARY KEY ("sponsorTenureStatsId")
);

-- CreateIndex
CREATE UNIQUE INDEX "SponsorTenureStats_sponsorTenureStatsId_key" ON "SponsorTenureStats"("sponsorTenureStatsId");

-- CreateIndex
CREATE UNIQUE INDEX "SponsorTenureStats_name_key" ON "SponsorTenureStats"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SponsorTenureStats_playerId_key" ON "SponsorTenureStats"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "Auction_sponsorTenureStatsId_key" ON "Auction"("sponsorTenureStatsId");

-- AddForeignKey
ALTER TABLE "SponsorTenureStats" ADD CONSTRAINT "SponsorTenureStats_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("playerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auction" ADD CONSTRAINT "Auction_sponsorTenureStatsId_fkey" FOREIGN KEY ("sponsorTenureStatsId") REFERENCES "SponsorTenureStats"("sponsorTenureStatsId") ON DELETE SET NULL ON UPDATE CASCADE;
