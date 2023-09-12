-- AlterTable
ALTER TABLE "PlayerRoundStats" ALTER COLUMN "estimatedViewTime" SET DEFAULT 0,
ALTER COLUMN "estimatedViewTime" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "TeamRoundStats" ALTER COLUMN "estimatedViewTime" SET DEFAULT 0,
ALTER COLUMN "estimatedViewTime" SET DATA TYPE DOUBLE PRECISION;
