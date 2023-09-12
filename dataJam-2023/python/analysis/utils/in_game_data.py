from src.prisma import prisma

from .timestamps import convert_str_timestamp_to_timestamp


class InGameDataCsGo:
    def __init__(self):
        self._conn = prisma

    async def get_player_damaged_player_event(self, event_id: str) -> dict:
        player_damage_player_raw_data = (
            await self._conn.playerdamagedplayerevent.find_first(
                where={
                    "eventId": event_id,
                }
            )
        )

        player_damage_player_data = player_damage_player_raw_data.dict()

        return player_damage_player_data

    async def get_player_killed_player_event(self, event_id: str) -> dict:
        player_killed_player_raw_data = (
            await self._conn.playerkilledplayerevent.find_first(
                where={
                    "eventId": event_id,
                }
            )
        )

        player_killed_player_data = player_killed_player_raw_data.dict()

        return player_killed_player_data

    async def get_rounds_by_match_id(self, match_id: str) -> list:
        match_rounds_raw_data = await self._conn.round.find_many(
            where={
                "matchId": match_id,
            },
            include={"events": True},
        )

        match_rounds_data = []
        for match_round_raw_data in match_rounds_raw_data:
            match_rounds_data.append(match_round_raw_data.dict())

        return match_rounds_data

    async def get_rounds_pdp_pkp_data_by_match_id(self, match_id: str) -> dict:
        rounds_by_match_id = await self.get_rounds_by_match_id(match_id)

        # rounds_data = {
        #     round_id: {
        #         pdp: {
        #             actor: {
        #                 target: [(d_d, t_d),...]
        #             }
        #         }
        #         pkp: {
        #             actor: {
        #                 target: (true, t_k)
        #             }
        #         }
        #     }
        # }
        rounds_pdp_pkp_data = {}
        for round in rounds_by_match_id:
            round_id = round["roundId"]

            pdp_pkp_events = {
                "pdp": {},
                "pkp": {},
            }
            for event in round["events"]:
                event_id = event["eventId"]
                timestamp = event["timestamp"]

                if event["eventType"] == "PLAYER_DAMAGED_PLAYER":
                    player_damaged_player_event = (
                        await self.get_player_damaged_player_event(event_id)
                    )

                    actor = player_damaged_player_event["actorPlayerId"]
                    target = player_damaged_player_event["targetPlayerId"]
                    damage = player_damaged_player_event["damageDealt"]

                    if actor in pdp_pkp_events["pdp"]:
                        if target in pdp_pkp_events["pdp"][actor]:
                            pdp_pkp_events["pdp"][actor][target] += [
                                (damage, timestamp)
                            ]
                        else:
                            pdp_pkp_events["pdp"][actor] = {
                                target: [(damage, timestamp)]
                            }
                    else:
                        pdp_pkp_events["pdp"][actor] = {target: [(damage, timestamp)]}
                elif event["eventType"] == "PLAYER_KILLED_PLAYER":
                    player_killed_player_event = (
                        await self.get_player_killed_player_event(event_id)
                    )

                    actor = player_killed_player_event["actorPlayerId"]
                    target = player_killed_player_event["targetPlayerId"]

                    if actor in pdp_pkp_events["pkp"]:
                        if target in pdp_pkp_events["pkp"][actor]:
                            continue
                        else:
                            pdp_pkp_events["pkp"][actor][target] = (True, timestamp)
                    else:
                        pdp_pkp_events["pkp"][actor] = {target: (True, timestamp)}

            rounds_pdp_pkp_data[round_id] = pdp_pkp_events

        return rounds_pdp_pkp_data

    async def get_rounds_pdp_pkp_data_by_match_ids(self, match_ids: list[str]) -> dict:
        rounds_pdp_pkp_data_by_match_ids = {}
        for match_id in match_ids:
            rounds_pdp_pkp_data_by_match_id = (
                await self.get_rounds_pdp_pkp_data_by_match_id(match_id)
            )

            rounds_pdp_pkp_data_by_match_ids[match_id] = rounds_pdp_pkp_data_by_match_id

        return rounds_pdp_pkp_data_by_match_ids

    async def get_players_rounds_stats_by_match_id(self, match_id: str) -> list:
        rounds_data_raw = await self._conn.round.find_many(
            where={
                "matchId": match_id,
            },
            include={"playerRoundStats": True},
        )

        players_rounds_stats = []
        for round_data_raw in rounds_data_raw:
            round_data_raw = round_data_raw.dict()

            players_round_stats = []
            for player_round_stats in round_data_raw["playerRoundStats"]:
                player_round_stats["matchId"] = round_data_raw["matchId"]

                players_round_stats.append(player_round_stats)

            players_rounds_stats += players_round_stats

        return players_rounds_stats

    async def get_players_rounds_stats_by_match_ids(self, match_ids: list[str]) -> dict:
        players_rounds_stats_by_match_ids = {}
        for match_id in match_ids:
            players_rounds_stats = await self.get_players_rounds_stats_by_match_id(
                match_id
            )

            players_rounds_stats_by_match_ids[match_id] = players_rounds_stats

        return players_rounds_stats_by_match_ids

    async def connect(self):
        if not self._conn.is_connected():
            await prisma.connect()

    async def disconnect(self):
        await self._conn.disconnect()

    async def is_connected(self):
        return self._conn.is_connected()
