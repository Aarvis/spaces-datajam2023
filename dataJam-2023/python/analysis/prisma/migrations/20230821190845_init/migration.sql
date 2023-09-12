-- AlterTable
ALTER TABLE "PlayerRoundStats" ADD COLUMN     "estimatedViewTime" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "TeamRoundStats" ADD COLUMN     "estimatedViewTime" INTEGER NOT NULL DEFAULT 0;
