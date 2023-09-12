-- CreateTable
CREATE TABLE "ScoreBoard" (
    "scoreBoardId" TEXT NOT NULL,
    "matchId" TEXT,
    "roundsWonTeamA" INTEGER NOT NULL DEFAULT 0,
    "teamAId" TEXT NOT NULL,
    "roundsWonTeamB" INTEGER NOT NULL DEFAULT 0,
    "teamBID" TEXT NOT NULL,
    "wonTeamId" TEXT,
    "bombPlanted" BOOLEAN NOT NULL DEFAULT false,
    "bombExploded" BOOLEAN NOT NULL DEFAULT false,
    "bombDiffused" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ScoreBoard_pkey" PRIMARY KEY ("scoreBoardId")
);

-- CreateTable
CREATE TABLE "ScoreboardPlayerCard" (
    "scoreboardPlayerCardId" TEXT NOT NULL,
    "scoreBoardId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "kills" INTEGER NOT NULL DEFAULT 0,
    "deaths" INTEGER NOT NULL DEFAULT 0,
    "assists" INTEGER NOT NULL DEFAULT 0,
    "health" INTEGER NOT NULL DEFAULT 100,
    "alive" BOOLEAN NOT NULL DEFAULT true,
    "armor" INTEGER NOT NULL DEFAULT 100,
    "itemsOwned" JSONB,
    "teamId" TEXT NOT NULL,
    "damageDealtInstant" BOOLEAN NOT NULL DEFAULT false,
    "damageTakenInstant" BOOLEAN NOT NULL DEFAULT false,
    "bombDefusing" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ScoreboardPlayerCard_pkey" PRIMARY KEY ("scoreboardPlayerCardId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ScoreBoard_scoreBoardId_key" ON "ScoreBoard"("scoreBoardId");

-- CreateIndex
CREATE UNIQUE INDEX "ScoreBoard_matchId_key" ON "ScoreBoard"("matchId");

-- CreateIndex
CREATE UNIQUE INDEX "ScoreboardPlayerCard_scoreboardPlayerCardId_key" ON "ScoreboardPlayerCard"("scoreboardPlayerCardId");

-- AddForeignKey
ALTER TABLE "ScoreBoard" ADD CONSTRAINT "ScoreBoard_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("matchId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoreboardPlayerCard" ADD CONSTRAINT "ScoreboardPlayerCard_scoreBoardId_fkey" FOREIGN KEY ("scoreBoardId") REFERENCES "ScoreBoard"("scoreBoardId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoreboardPlayerCard" ADD CONSTRAINT "ScoreboardPlayerCard_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("playerId") ON DELETE RESTRICT ON UPDATE CASCADE;
