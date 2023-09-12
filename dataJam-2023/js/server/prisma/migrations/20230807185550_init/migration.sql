-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('PLAYER_DAMAGED_PLAYER', 'PLAYER_SELF_KILLED_PLAYER', 'PLAYER_TEAM_KILLED_PLAYER', 'PLAYER_TEAM_DAMAGED_PLAYER', 'PLAYER_SELF_DAMAGED_PLAYER', 'PLAYER_KILLED_PLAYER', 'PLAYER_COMPLETED_DEFUSE_BOMB');

-- CreateTable
CREATE TABLE "Player" (
    "playerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "kills" INTEGER NOT NULL DEFAULT 0,
    "deaths" INTEGER NOT NULL DEFAULT 0,
    "killAssistsReceived" INTEGER NOT NULL DEFAULT 0,
    "killAssistsGiven" INTEGER NOT NULL DEFAULT 0,
    "selfkills" INTEGER NOT NULL DEFAULT 0,
    "headshots" INTEGER NOT NULL DEFAULT 0,
    "overallViewTime" INTEGER NOT NULL DEFAULT 0,
    "overallViewPercentage" INTEGER NOT NULL DEFAULT 0,
    "overallDamageDealt" INTEGER NOT NULL DEFAULT 0,
    "overallDamageTaken" INTEGER NOT NULL DEFAULT 0,
    "weaponKills" JSONB,
    "overallAce" INTEGER NOT NULL DEFAULT 0,
    "overallClutch" INTEGER NOT NULL DEFAULT 0,
    "teamId" TEXT NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("playerId")
);

-- CreateTable
CREATE TABLE "Team" (
    "teamId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "kills" INTEGER NOT NULL DEFAULT 0,
    "deaths" INTEGER NOT NULL DEFAULT 0,
    "headshots" INTEGER NOT NULL DEFAULT 0,
    "overallViewTime" INTEGER NOT NULL DEFAULT 0,
    "overallViewPercentage" INTEGER NOT NULL DEFAULT 0,
    "overallDamageDealt" INTEGER NOT NULL DEFAULT 0,
    "overallDamageTaken" INTEGER NOT NULL DEFAULT 0,
    "weaponKills" JSONB,
    "overallAce" INTEGER NOT NULL DEFAULT 0,
    "overallClutch" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("teamId")
);

-- CreateTable
CREATE TABLE "Round" (
    "roundId" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "roundLastedTime" INTEGER NOT NULL,

    CONSTRAINT "Round_pkey" PRIMARY KEY ("roundId")
);

-- CreateTable
CREATE TABLE "Match" (
    "matchId" TEXT NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("matchId")
);

-- CreateTable
CREATE TABLE "PlayerOnMatch" (
    "playerId" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,

    CONSTRAINT "PlayerOnMatch_pkey" PRIMARY KEY ("playerId","matchId")
);

-- CreateTable
CREATE TABLE "TeamOnMatch" (
    "teamId" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,

    CONSTRAINT "TeamOnMatch_pkey" PRIMARY KEY ("teamId","matchId")
);

-- CreateTable
CREATE TABLE "PlayerRoundStats" (
    "id" TEXT NOT NULL,
    "playerViewTime" INTEGER NOT NULL DEFAULT 0,
    "LastPersonStandingTime" INTEGER NOT NULL DEFAULT 0,
    "viewTimePercentage" TEXT,
    "Ace" BOOLEAN NOT NULL DEFAULT false,
    "Clutch" BOOLEAN NOT NULL DEFAULT false,
    "kills" INTEGER NOT NULL DEFAULT 0,
    "killAssistsReceived" INTEGER NOT NULL DEFAULT 0,
    "killAssistsGiven" INTEGER NOT NULL DEFAULT 0,
    "selfkills" INTEGER NOT NULL DEFAULT 0,
    "deaths" INTEGER NOT NULL DEFAULT 0,
    "headshots" INTEGER NOT NULL DEFAULT 0,
    "damageDealt" INTEGER NOT NULL DEFAULT 0,
    "damageTaken" INTEGER NOT NULL DEFAULT 0,
    "weaponKills" JSONB,
    "roundId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,

    CONSTRAINT "PlayerRoundStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamRoundStats" (
    "id" TEXT NOT NULL,
    "teamViewTime" INTEGER NOT NULL DEFAULT 0,
    "viewTimePercentage" TEXT,
    "side" TEXT NOT NULL,
    "won" BOOLEAN NOT NULL DEFAULT false,
    "winType" TEXT,
    "kills" INTEGER NOT NULL DEFAULT 0,
    "deaths" INTEGER NOT NULL DEFAULT 0,
    "damageDealt" INTEGER NOT NULL DEFAULT 0,
    "damageTaken" INTEGER NOT NULL DEFAULT 0,
    "selfKills" INTEGER NOT NULL DEFAULT 0,
    "weaponKills" JSONB,
    "headshots" INTEGER NOT NULL DEFAULT 0,
    "roundId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,

    CONSTRAINT "TeamRoundStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "eventId" TEXT NOT NULL,
    "eventType" "EventType" NOT NULL,
    "matchId" TEXT NOT NULL,
    "roundId" TEXT NOT NULL,
    "timestamp" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "SeriesStartedGameEvent" (
    "seriesStartedGameEventId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "gameIdStarted" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "GameStartedRoundEvent" (
    "gameStartedRoundEventId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "roundIdStarted" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "GameEndedRoundEvent" (
    "gameEndedRoundEventId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "roundIdEnded" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "PlayerSelfDamagedPlayerEvent" (
    "playerSelfDamagedPlayerEventId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "actorPlayerId" TEXT NOT NULL,
    "damageDealt" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "PlayerTeamDamagedPlayerEvent" (
    "playerTeamDamagedPlayerEventId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "actorPlayerId" TEXT NOT NULL,
    "targetPlayerId" TEXT NOT NULL,
    "damageDealt" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "PlayerTeamKilledPlayerEvent" (
    "playerTeamKilledPlayerEventId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "actorPlayerId" TEXT NOT NULL,
    "targetPlayerId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "PlayerSelfKilledPlayerEvent" (
    "playerSelfKilledPlayerEventId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "actorPlayerId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "PlayerDamagedPlayerEvent" (
    "playerDamagedPlayerEventId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "actorPlayerId" TEXT NOT NULL,
    "targetPlayerId" TEXT NOT NULL,
    "damageDealt" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "PlayerKilledPlayerEvent" (
    "playerKilledPlayerEventId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "actorPlayerId" TEXT NOT NULL,
    "targetPlayerId" TEXT NOT NULL,
    "weaponKill" JSONB NOT NULL,
    "headShot" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "PlayerCompletedDefuseBombEvent" (
    "playerCompletedDefuseBombEventId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "actorPlayerId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_playerId_key" ON "Player"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_teamId_key" ON "Team"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "Round_roundId_key" ON "Round"("roundId");

-- CreateIndex
CREATE UNIQUE INDEX "Match_matchId_key" ON "Match"("matchId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerRoundStats_id_key" ON "PlayerRoundStats"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TeamRoundStats_id_key" ON "TeamRoundStats"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Event_eventId_key" ON "Event"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "SeriesStartedGameEvent_seriesStartedGameEventId_key" ON "SeriesStartedGameEvent"("seriesStartedGameEventId");

-- CreateIndex
CREATE UNIQUE INDEX "SeriesStartedGameEvent_eventId_key" ON "SeriesStartedGameEvent"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "GameStartedRoundEvent_gameStartedRoundEventId_key" ON "GameStartedRoundEvent"("gameStartedRoundEventId");

-- CreateIndex
CREATE UNIQUE INDEX "GameStartedRoundEvent_eventId_key" ON "GameStartedRoundEvent"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "GameEndedRoundEvent_gameEndedRoundEventId_key" ON "GameEndedRoundEvent"("gameEndedRoundEventId");

-- CreateIndex
CREATE UNIQUE INDEX "GameEndedRoundEvent_eventId_key" ON "GameEndedRoundEvent"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerSelfDamagedPlayerEvent_playerSelfDamagedPlayerEventId_key" ON "PlayerSelfDamagedPlayerEvent"("playerSelfDamagedPlayerEventId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerSelfDamagedPlayerEvent_eventId_key" ON "PlayerSelfDamagedPlayerEvent"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerTeamDamagedPlayerEvent_playerTeamDamagedPlayerEventId_key" ON "PlayerTeamDamagedPlayerEvent"("playerTeamDamagedPlayerEventId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerTeamDamagedPlayerEvent_eventId_key" ON "PlayerTeamDamagedPlayerEvent"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerTeamKilledPlayerEvent_playerTeamKilledPlayerEventId_key" ON "PlayerTeamKilledPlayerEvent"("playerTeamKilledPlayerEventId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerTeamKilledPlayerEvent_eventId_key" ON "PlayerTeamKilledPlayerEvent"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerSelfKilledPlayerEvent_playerSelfKilledPlayerEventId_key" ON "PlayerSelfKilledPlayerEvent"("playerSelfKilledPlayerEventId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerSelfKilledPlayerEvent_eventId_key" ON "PlayerSelfKilledPlayerEvent"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerDamagedPlayerEvent_playerDamagedPlayerEventId_key" ON "PlayerDamagedPlayerEvent"("playerDamagedPlayerEventId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerDamagedPlayerEvent_eventId_key" ON "PlayerDamagedPlayerEvent"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerKilledPlayerEvent_playerKilledPlayerEventId_key" ON "PlayerKilledPlayerEvent"("playerKilledPlayerEventId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerKilledPlayerEvent_eventId_key" ON "PlayerKilledPlayerEvent"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerCompletedDefuseBombEvent_playerCompletedDefuseBombEve_key" ON "PlayerCompletedDefuseBombEvent"("playerCompletedDefuseBombEventId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerCompletedDefuseBombEvent_eventId_key" ON "PlayerCompletedDefuseBombEvent"("eventId");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("teamId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Round" ADD CONSTRAINT "Round_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("matchId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerOnMatch" ADD CONSTRAINT "PlayerOnMatch_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("playerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerOnMatch" ADD CONSTRAINT "PlayerOnMatch_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("matchId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamOnMatch" ADD CONSTRAINT "TeamOnMatch_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("teamId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamOnMatch" ADD CONSTRAINT "TeamOnMatch_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("matchId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerRoundStats" ADD CONSTRAINT "PlayerRoundStats_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "Round"("roundId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerRoundStats" ADD CONSTRAINT "PlayerRoundStats_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("playerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamRoundStats" ADD CONSTRAINT "TeamRoundStats_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "Round"("roundId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamRoundStats" ADD CONSTRAINT "TeamRoundStats_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("teamId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "Round"("roundId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeriesStartedGameEvent" ADD CONSTRAINT "SeriesStartedGameEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameStartedRoundEvent" ADD CONSTRAINT "GameStartedRoundEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameEndedRoundEvent" ADD CONSTRAINT "GameEndedRoundEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerSelfDamagedPlayerEvent" ADD CONSTRAINT "PlayerSelfDamagedPlayerEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerTeamDamagedPlayerEvent" ADD CONSTRAINT "PlayerTeamDamagedPlayerEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerTeamKilledPlayerEvent" ADD CONSTRAINT "PlayerTeamKilledPlayerEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerSelfKilledPlayerEvent" ADD CONSTRAINT "PlayerSelfKilledPlayerEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerDamagedPlayerEvent" ADD CONSTRAINT "PlayerDamagedPlayerEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerKilledPlayerEvent" ADD CONSTRAINT "PlayerKilledPlayerEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerCompletedDefuseBombEvent" ADD CONSTRAINT "PlayerCompletedDefuseBombEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;
