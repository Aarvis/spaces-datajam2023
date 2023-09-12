/*
  Warnings:

  - You are about to drop the column `weaponKill` on the `PlayerKilledPlayerEvent` table. All the data in the column will be lost.
  - Added the required column `weaponKills` to the `PlayerKilledPlayerEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PlayerKilledPlayerEvent" DROP COLUMN "weaponKill",
ADD COLUMN     "weaponKills" JSONB NOT NULL;
