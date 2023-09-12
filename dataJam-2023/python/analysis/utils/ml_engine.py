import functools as ft
from itertools import combinations

import numpy as np
import pandas as pd

from .timestamps import convert_str_timestamp_to_timestamp

from .in_game_data import InGameDataCsGo


class InGameDataMachineLearningEngineCsGo(InGameDataCsGo):
    def __init__(self):
        super().__init__()

    async def get_players_damage_kill_moments(
        self, match_ids: list[str], damage_kill_delta_t_threshold: float = 0.5
    ) -> pd.DataFrame:
        rounds_pdp_pkp_data = await self.get_rounds_pdp_pkp_data_by_match_ids(match_ids)

        rounds_pdp_pkp_data_flattened = {}
        for x in rounds_pdp_pkp_data.values():
            rounds_pdp_pkp_data_flattened.update(x)

        players_damage_kill_moments_t = {}
        for round_id, round_data in rounds_pdp_pkp_data_flattened.items():
            # Round
            for actor_id, target_data in round_data["pkp"].items():
                # Actor
                for target_id, (_, kill_timestamp) in target_data.items():
                    # Target
                    if actor_id in round_data["pdp"]:
                        if target_id in round_data["pdp"][actor_id]:
                            n = len(round_data["pdp"][actor_id][target_id])

                            if n <= 1:
                                continue

                            delta_ts = []
                            for i in reversed(range(1, n)):
                                _, damage_timestamp_i = round_data["pdp"][actor_id][
                                    target_id
                                ][i]
                                _, damage_timestamp_i_min_1 = round_data["pdp"][
                                    actor_id
                                ][target_id][i - 1]

                                delta_t = convert_str_timestamp_to_timestamp(
                                    damage_timestamp_i
                                ) - convert_str_timestamp_to_timestamp(
                                    damage_timestamp_i_min_1
                                )

                                if delta_t > damage_kill_delta_t_threshold:
                                    break

                                delta_ts.append(delta_t)

                            damage_kill_moment_t = sum(delta_ts)

                            if damage_kill_moment_t <= 0.0:
                                continue

                            if actor_id in players_damage_kill_moments_t:
                                players_damage_kill_moments_t[actor_id] += [
                                    damage_kill_moment_t
                                ]
                            else:
                                players_damage_kill_moments_t[actor_id] = [
                                    damage_kill_moment_t
                                ]

        players_damage_kill_moments = []
        for player_id, damage_kill_moments_t in players_damage_kill_moments_t.items():
            players_damage_kill_moments += [
                {
                    "playerId": player_id,
                    "damageKillKeyMomentCount": len(damage_kill_moments_t),
                    "damageKillKeyMomentTotalTime": np.sum(damage_kill_moments_t),
                }
            ]

        players_damage_kill_moments = pd.DataFrame(players_damage_kill_moments)

        return players_damage_kill_moments

    async def get_players_kill_kill_moments(
        self, match_ids: list[str], kill_kill_delta_t_threshold: float = 2.0
    ) -> pd.DataFrame:
        rounds_pdp_pkp_data = await self.get_rounds_pdp_pkp_data_by_match_ids(match_ids)

        rounds_pdp_pkp_data_flattened = {}
        for x in rounds_pdp_pkp_data.values():
            rounds_pdp_pkp_data_flattened.update(x)

        players_kill_kill_moments_t = {}
        for round_id, round_data in rounds_pdp_pkp_data_flattened.items():
            # Round
            for actor_id, target_data in round_data["pkp"].items():
                # Actor
                kill_timestamps = []
                for target_id, (_, kill_timestamp) in target_data.items():
                    # Target
                    kill_timestamps.append(kill_timestamp)

                n = len(kill_timestamps)

                if n <= 1:
                    continue

                delta_ts = []
                for i in reversed(range(1, n)):
                    kill_timestamp_i = kill_timestamps[i]
                    kill_timestamp_i_min_1 = kill_timestamps[i - 1]

                    delta_t = convert_str_timestamp_to_timestamp(
                        kill_timestamp_i
                    ) - convert_str_timestamp_to_timestamp(kill_timestamp_i_min_1)

                    if delta_t > kill_kill_delta_t_threshold:
                        break

                    delta_ts.append(delta_t)

                kill_kill_moment_t = sum(delta_ts)

                if kill_kill_moment_t <= 0.0:
                    continue

                if actor_id in players_kill_kill_moments_t:
                    players_kill_kill_moments_t[actor_id] += [kill_kill_moment_t]
                else:
                    players_kill_kill_moments_t[actor_id] = [kill_kill_moment_t]

        players_kill_kill_moments = []
        for player_id, kill_kill_moments_t in players_kill_kill_moments_t.items():
            players_kill_kill_moments += [
                {
                    "playerId": player_id,
                    "killKillKeyMomentCount": len(kill_kill_moments_t),
                    "killKillKeyMomentTotalTime": np.sum(kill_kill_moments_t),
                }
            ]

        players_kill_kill_moments = pd.DataFrame(players_kill_kill_moments)

        return players_kill_kill_moments

    async def get_player_damage_kill_information_index_by_match_ids(
        self, match_ids: list[str]
    ) -> pd.DataFrame:
        rounds_pdp_pkp_data = await self.get_rounds_pdp_pkp_data_by_match_ids(match_ids)

        rounds_pdp_pkp_data_flattened = {}
        for x in rounds_pdp_pkp_data.values():
            rounds_pdp_pkp_data_flattened.update(x)

        player_damage_kill_information_index_raw_data = {}
        for round_id, round_data in rounds_pdp_pkp_data_flattened.items():
            # Round
            for actor_id, target_data in round_data["pkp"].items():
                # Actor
                for target_id, (_, kill_timestamp) in target_data.items():
                    # Target
                    kill_damage_delta_t = []
                    if actor_id in round_data["pdp"]:
                        if target_id in round_data["pdp"][actor_id]:
                            for damage_dealt, damage_timestamp in round_data["pdp"][
                                actor_id
                            ][target_id]:
                                kill_damage_delta_t.append(
                                    convert_str_timestamp_to_timestamp(kill_timestamp)
                                    - convert_str_timestamp_to_timestamp(
                                        damage_timestamp
                                    )
                                )

                    if actor_id in player_damage_kill_information_index_raw_data:
                        player_damage_kill_information_index_raw_data[
                            actor_id
                        ] += kill_damage_delta_t
                    else:
                        player_damage_kill_information_index_raw_data[
                            actor_id
                        ] = kill_damage_delta_t

        players_damage_kill_information_index = []
        for player, data in player_damage_kill_information_index_raw_data.items():
            mean_t_k_diff_t_d = np.mean(data)
            std_t_k_diff_t_d = np.std(data)
            player_damage_kill_information_index = std_t_k_diff_t_d / mean_t_k_diff_t_d

            players_damage_kill_information_index += [
                {
                    "playerId": player,
                    "player_damage_kill_information_index": player_damage_kill_information_index,
                }
            ]

        players_damage_kill_information_index = pd.DataFrame(
            players_damage_kill_information_index
        )

        return players_damage_kill_information_index

    async def get_player_kill_kill_information_index_by_match_ids(
        self, match_ids: list[str]
    ) -> pd.DataFrame:
        rounds_pdp_pkp_data = await self.get_rounds_pdp_pkp_data_by_match_ids(match_ids)

        rounds_pdp_pkp_data_flattened = {}
        for x in rounds_pdp_pkp_data.values():
            rounds_pdp_pkp_data_flattened.update(x)

        player_kill_kill_information_index_raw_data = {}
        for round_id, round_data in rounds_pdp_pkp_data_flattened.items():
            # Round
            for actor_id, target_data in round_data["pkp"].items():
                # Actor
                kill_timestamps = []
                for target_id, (_, kill_timestamp) in target_data.items():
                    # Target
                    kill_timestamps.append(kill_timestamp)

                if len(kill_timestamps) > 1:
                    idxs = list(combinations(range(len(kill_timestamps)), 2))

                    kill_timestamps_delta_t = []
                    for i, j in idxs:
                        kill_timestamps_delta_t.append(
                            abs(
                                convert_str_timestamp_to_timestamp(kill_timestamps[i])
                                - convert_str_timestamp_to_timestamp(kill_timestamps[j])
                            )
                        )

                    if actor_id in player_kill_kill_information_index_raw_data:
                        player_kill_kill_information_index_raw_data[
                            actor_id
                        ] += kill_timestamps_delta_t
                    else:
                        player_kill_kill_information_index_raw_data[
                            actor_id
                        ] = kill_timestamps_delta_t
                else:
                    continue

        players_kill_kill_information_index = []
        for player, data in player_kill_kill_information_index_raw_data.items():
            mean_t_k_diff_t_k = np.mean(data) + 1e-1
            std_t_k_diff_t_k = np.std(data)
            player_kill_kill_information_index = std_t_k_diff_t_k / mean_t_k_diff_t_k

            players_kill_kill_information_index += [
                {
                    "playerId": player,
                    "player_kill_kill_information_index": player_kill_kill_information_index,
                }
            ]

        players_kill_kill_information_index = pd.DataFrame(
            players_kill_kill_information_index
        )

        return players_kill_kill_information_index

    async def get_players_general_stats(self, match_ids: list[str]) -> pd.DataFrame:
        players_rounds_stats_by_match_ids = (
            await self.get_players_rounds_stats_by_match_ids(match_ids)
        )

        players_rounds_stats_by_match_ids_flattened = []
        for x in players_rounds_stats_by_match_ids.values():
            players_rounds_stats_by_match_ids_flattened += x

        players_rounds_stats_by_match_ids_flattened = pd.DataFrame(
            players_rounds_stats_by_match_ids_flattened
        )

        columns_average = [
            "estimatedViewTime",
            "LastPersonStandingTime",
            "damageDealt",
            "percentageOppTeamkilled",
        ]
        columns_count = ["Ace", "Clutch", "kills", "headshots"]

        players_stats_averages = (
            players_rounds_stats_by_match_ids_flattened[["playerId"] + columns_average]
            .groupby(["playerId"])
            .mean()
            .reset_index()
        )
        players_stats_counts = (
            players_rounds_stats_by_match_ids_flattened[["playerId"] + columns_count]
            .groupby(["playerId"])
            .sum()
            .reset_index()
        )
        players_rounds_count = (
            players_rounds_stats_by_match_ids_flattened[["playerId", "roundId"]]
            .groupby(["playerId"])
            .nunique()
            .reset_index()
        )
        players_matches_count = (
            players_rounds_stats_by_match_ids_flattened[["playerId", "matchId"]]
            .groupby(["playerId"])
            .nunique()
            .reset_index()
        )

        players_general_stats = [
            players_stats_averages,
            players_stats_counts,
            players_rounds_count,
            players_matches_count,
        ]

        players_general_stats = ft.reduce(
            lambda left, right: pd.merge(left, right, on="playerId", how="outer"),
            players_general_stats,
        )

        return players_general_stats

    async def get_players_stats(self, match_ids: list[str]) -> pd.DataFrame:
        # General stats.
        players_general_stats = await self.get_players_general_stats(match_ids)

        # Information indices.
        players_damage_kill_information_index = (
            await self.get_player_damage_kill_information_index_by_match_ids(match_ids)
        )
        players_kill_kill_information_index = (
            await self.get_player_kill_kill_information_index_by_match_ids(match_ids)
        )

        # Key moments stats.
        players_damage_kill_moments = await self.get_players_damage_kill_moments(
            match_ids
        )
        players_kill_kill_moments = await self.get_players_kill_kill_moments(match_ids)

        # Merge all stats.
        players_stats = [
            players_general_stats,
            players_damage_kill_information_index,
            players_kill_kill_information_index,
            players_damage_kill_moments,
            players_kill_kill_moments,
        ]

        players_stats = ft.reduce(
            lambda left, right: pd.merge(left, right, on="playerId", how="outer"),
            players_stats,
        )

        players_stats.rename(
            columns={
                "estimatedViewTime": "averageEstimatedPlayerViewTime",
                "LastPersonStandingTime": "averageLastManStandingTime",
                "damageDealt": "averageDamageDealt",
                "percentageOppTeamkilled": "averagePercentOpponentTeamKilled",
                "Ace": "totalNumberOfAces",
                "Clutch": "totalNumberOfClutches",
                "kills": "totalNumberOfKills",
                "headshots": "totalNumberOfHeadshots",
                "roundId": "numberOfRoundsPlayed",
                "matchId": "numberOfMatchesPlayed",
                "player_damage_kill_information_index": "playerDamageKillInformationIndex",
                "player_kill_kill_information_index": "playerKillKillInformationIndex",
            },
            inplace=True,
        )

        players_stats.fillna(0, inplace=True)

        return players_stats
