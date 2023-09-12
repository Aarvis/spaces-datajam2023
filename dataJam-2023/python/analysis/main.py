import pandas as pd
import asyncio

from src.prisma import prisma
from utils.ml_engine import InGameDataMachineLearningEngineCsGo

in_game_data_ml_engine_cs_go = InGameDataMachineLearningEngineCsGo()

async def main(): 
    await in_game_data_ml_engine_cs_go.connect()

    match_ids = [
    "4198c9e0-fee4-44b9-994f-1fce92a62396",
    "48edea41-cfbf-4df4-9db1-95ceb5121f56",
    "5061e2fb-b880-4705-9466-dd3d25d55a03",
    "5158f4a5-02ac-47ee-b153-7796b5800d3f",
    "c5c7500c-6db8-45c8-b6ab-2be01b401ef7",
    "c7c65bec-8c54-4dea-afcd-c057320e1f8f",
    ]

    players_stats = await in_game_data_ml_engine_cs_go.get_players_stats(match_ids)

    players_stats["totalKeyMomentCount"] = players_stats["damageKillKeyMomentCount"] + players_stats["killKillKeyMomentCount"]
    players_stats["totalKeyMomentTime"] = players_stats["damageKillKeyMomentTotalTime"] + players_stats["killKillKeyMomentTotalTime"]   

    async def post_player_stats_to_db(players_stats_df: pd.DataFrame):
        async with prisma.batch_() as batcher:
            players_stats = players_stats_df.to_dict("records")

            for player_stat in players_stats:
                batcher.playercard.create(player_stat)

            await batcher.commit()

    await post_player_stats_to_db(players_stats)

    await in_game_data_ml_engine_cs_go.disconnect()

loop = asyncio.get_event_loop()
loop.run_until_complete(main())

