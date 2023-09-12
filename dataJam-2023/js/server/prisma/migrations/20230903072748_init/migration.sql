/*
  Warnings:

  - You are about to drop the column `averageHeadshotsPerRound` on the `PlayerCard` table. All the data in the column will be lost.
  - You are about to drop the column `averageKillsPerRound` on the `PlayerCard` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PlayerCard" DROP COLUMN "averageHeadshotsPerRound",
DROP COLUMN "averageKillsPerRound",
ADD COLUMN     "damageKillKeyMomentCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "damageKillKeyMomentTotalTime" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "killKillKeyMomentCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "killKillKeyMomentTotalTime" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "totalKeyMomentCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalKeyMomentTime" DOUBLE PRECISION NOT NULL DEFAULT 0;
