-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EventType" ADD VALUE 'GAME_STARTED_ROUND';
ALTER TYPE "EventType" ADD VALUE 'GANE_ENDED_ROUND';

-- AlterTable
ALTER TABLE "Round" ALTER COLUMN "roundLastedTime" DROP NOT NULL;
