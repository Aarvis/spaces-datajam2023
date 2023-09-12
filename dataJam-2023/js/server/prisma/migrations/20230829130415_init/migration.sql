/*
  Warnings:

  - A unique constraint covering the columns `[passwordHash]` on the table `Player` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Player` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[passwordHash]` on the table `Sponsor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sponsorName]` on the table `Sponsor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tenureStartDate` to the `Auction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordHash` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordHash` to the `Sponsor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Auction" ADD COLUMN     "tenureStartDate" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "passwordHash" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Sponsor" ADD COLUMN     "passwordHash" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Player_passwordHash_key" ON "Player"("passwordHash");

-- CreateIndex
CREATE UNIQUE INDEX "Player_name_key" ON "Player"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Sponsor_passwordHash_key" ON "Sponsor"("passwordHash");

-- CreateIndex
CREATE UNIQUE INDEX "Sponsor_sponsorName_key" ON "Sponsor"("sponsorName");
