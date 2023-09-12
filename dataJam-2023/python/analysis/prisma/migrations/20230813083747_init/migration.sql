-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EventType" ADD VALUE 'PLAYER_COMPLETED_EXPLODE_BOMB';
ALTER TYPE "EventType" ADD VALUE 'PLAYER_COMPLETED_PLANT_BOMB';
ALTER TYPE "EventType" ADD VALUE 'PLAYER_COMPLETED_BEGIN_DEFUSE_WITH_KIT';
ALTER TYPE "EventType" ADD VALUE 'PLAYER_COMPLTED_BEGIN_DEFUSE_WITHOUT_KIT';

-- CreateTable
CREATE TABLE "PlayerCompletedExplodeBombEvent" (
    "playerCompletedExplodeBombEventId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "actorPlayerId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "PlayerCompletedPlantBombEvent" (
    "playerCompletedPlantBombEventId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "actorPlayerId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "PlayerCompletedBeginDefuseWithKitEvent" (
    "playerCompletedBeginDefuseWithKitId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "actorPlayerId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "PlayerCompletedBeginDefuseWithoutKitEvent" (
    "playerCompletedBeginDefuseWithoutKitId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "actorPlayerId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PlayerCompletedExplodeBombEvent_playerCompletedExplodeBombE_key" ON "PlayerCompletedExplodeBombEvent"("playerCompletedExplodeBombEventId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerCompletedExplodeBombEvent_eventId_key" ON "PlayerCompletedExplodeBombEvent"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerCompletedPlantBombEvent_playerCompletedPlantBombEvent_key" ON "PlayerCompletedPlantBombEvent"("playerCompletedPlantBombEventId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerCompletedPlantBombEvent_eventId_key" ON "PlayerCompletedPlantBombEvent"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerCompletedBeginDefuseWithKitEvent_playerCompletedBegin_key" ON "PlayerCompletedBeginDefuseWithKitEvent"("playerCompletedBeginDefuseWithKitId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerCompletedBeginDefuseWithKitEvent_eventId_key" ON "PlayerCompletedBeginDefuseWithKitEvent"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerCompletedBeginDefuseWithoutKitEvent_playerCompletedBe_key" ON "PlayerCompletedBeginDefuseWithoutKitEvent"("playerCompletedBeginDefuseWithoutKitId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerCompletedBeginDefuseWithoutKitEvent_eventId_key" ON "PlayerCompletedBeginDefuseWithoutKitEvent"("eventId");

-- AddForeignKey
ALTER TABLE "PlayerCompletedExplodeBombEvent" ADD CONSTRAINT "PlayerCompletedExplodeBombEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerCompletedPlantBombEvent" ADD CONSTRAINT "PlayerCompletedPlantBombEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerCompletedBeginDefuseWithKitEvent" ADD CONSTRAINT "PlayerCompletedBeginDefuseWithKitEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerCompletedBeginDefuseWithoutKitEvent" ADD CONSTRAINT "PlayerCompletedBeginDefuseWithoutKitEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;
