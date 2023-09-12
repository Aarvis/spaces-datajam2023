/*
  Warnings:

  - You are about to drop the column `selfkills` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `selfkills` on the `PlayerRoundStats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Player" DROP COLUMN "selfkills",
ADD COLUMN     "selfKills" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "PlayerRoundStats" DROP COLUMN "selfkills",
ADD COLUMN     "selfKills" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "teamDamageDealt" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "teamDamageTaken" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "teamKills" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "TeamRoundStats" ADD COLUMN     "teamDamageOccured" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "teamKillsOccured" INTEGER NOT NULL DEFAULT 0;
