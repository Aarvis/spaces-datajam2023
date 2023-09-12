/*
  Warnings:

  - You are about to drop the column `overallViewPercentage` on the `Player` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Player" DROP COLUMN "overallViewPercentage",
ADD COLUMN     "numberOfMatches" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "numberOfRounds" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "overallMomentsViewTime" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "overallPercentageOfOpponentTeamKilled" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "overallRoundEstimatedViewTime" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "overallRoundViewPercentage" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tournamentViewTime" INTEGER NOT NULL DEFAULT 0;
