/*
  Warnings:

  - You are about to drop the column `teamBID` on the `ScoreBoard` table. All the data in the column will be lost.
  - Added the required column `teamBId` to the `ScoreBoard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ScoreBoard" DROP COLUMN "teamBID",
ADD COLUMN     "teamBId" TEXT NOT NULL;
