-- CreateTable
CREATE TABLE "PlayerCard" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "averageEstimatedPlayerViewTime" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "averageLastManStandingTime" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "averageDamageDealt" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "averagePercentOpponentTeamKilled" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalNumberOfAces" INTEGER NOT NULL DEFAULT 0,
    "totalNumberOfClutches" INTEGER NOT NULL DEFAULT 0,
    "totalNumberOfKills" INTEGER NOT NULL DEFAULT 0,
    "totalNumberOfHeadshots" INTEGER NOT NULL DEFAULT 0,
    "numberOfRoundsPlayed" INTEGER NOT NULL DEFAULT 0,
    "numberOfMatchesPlayed" INTEGER NOT NULL DEFAULT 0,
    "playerDamageKillInformationIndex" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "playerKillKillInformationIndex" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "averageKillsPerRound" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "averageHeadshotsPerRound" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "PlayerCard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlayerCard_id_key" ON "PlayerCard"("id");

-- AddForeignKey
ALTER TABLE "PlayerCard" ADD CONSTRAINT "PlayerCard_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("playerId") ON DELETE RESTRICT ON UPDATE CASCADE;
