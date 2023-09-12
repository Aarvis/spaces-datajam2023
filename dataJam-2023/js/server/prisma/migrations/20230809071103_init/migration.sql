/*
  Warnings:

  - The values [GANE_ENDED_ROUND] on the enum `EventType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EventType_new" AS ENUM ('PLAYER_DAMAGED_PLAYER', 'PLAYER_SELF_KILLED_PLAYER', 'PLAYER_TEAM_KILLED_PLAYER', 'PLAYER_TEAM_DAMAGED_PLAYER', 'PLAYER_SELF_DAMAGED_PLAYER', 'PLAYER_KILLED_PLAYER', 'PLAYER_COMPLETED_DEFUSE_BOMB', 'GAME_STARTED_ROUND', 'GAME_ENDED_ROUND');
ALTER TABLE "Event" ALTER COLUMN "eventType" TYPE "EventType_new" USING ("eventType"::text::"EventType_new");
ALTER TYPE "EventType" RENAME TO "EventType_old";
ALTER TYPE "EventType_new" RENAME TO "EventType";
DROP TYPE "EventType_old";
COMMIT;
