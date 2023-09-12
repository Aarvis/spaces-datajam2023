/*
  Warnings:

  - You are about to drop the column `tournamentViewTime` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `tournamentViewTime` on the `SponsorTenureStats` table. All the data in the column will be lost.
  - Added the required column `profilePic` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamAName` to the `ScoreBoard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamBName` to the `ScoreBoard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Player" DROP COLUMN "tournamentViewTime",
ADD COLUMN     "profilePic" TEXT NOT NULL,
ADD COLUMN     "tournamentReach" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ScoreBoard" ADD COLUMN     "scoreBoardViewTime" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "teamAName" TEXT NOT NULL,
ADD COLUMN     "teamBName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SponsorTenureStats" DROP COLUMN "tournamentViewTime",
ADD COLUMN     "tournamentReach" DOUBLE PRECISION NOT NULL DEFAULT 0;
