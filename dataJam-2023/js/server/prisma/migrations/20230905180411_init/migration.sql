/*
  Warnings:

  - You are about to drop the column `name` on the `SponsorTenureStats` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "SponsorTenureStats_name_key";

-- AlterTable
ALTER TABLE "SponsorTenureStats" DROP COLUMN "name",
ALTER COLUMN "teamId" DROP NOT NULL;
