/*
  Warnings:

  - Added the required column `tournamentId` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "tournamentId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Tournament" (
    "tournamentId" TEXT NOT NULL,
    "format" TEXT NOT NULL,

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("tournamentId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tournament_tournamentId_key" ON "Tournament"("tournamentId");

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("tournamentId") ON DELETE RESTRICT ON UPDATE CASCADE;
