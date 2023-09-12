import os
import json
from collections import defaultdict

import websocket


events_counter = defaultdict(lambda: 0)


def on_message(ws, message):
    message = json.loads(message)

    events = message["events"]

    for event in events:
        events_counter[event["type"]] += 1

        if events_counter[event["type"]] == 1:
            actor = event["type"].split("-")[0]

            try:
                os.mkdir(f"../samples/{actor}")
                print(f"Directory '../samples/{actor}' created successfully.")
            except FileExistsError:
                print(f"Directory '../samples/{actor}' already exists.")
            except Exception as e:
                print(f"An error occurred: {e}")
                continue

            with open(f"../samples/{actor}/{event['type']}.json", "w") as json_file:
                json.dump(event, json_file)


def on_error(ws, error):
    print("Error:", error)


def on_close(ws, close_status_code, close_msg):
    print("Events Counter: ", events_counter)

    print("Closed:", close_msg)


def on_open(ws):
    print("Connected")

    ws.send("Hello, WebSocket!")


if __name__ == "__main__":
    base_url = "ws://localhost:8080"
    series_id = 2579089

    websocket_url = f"{base_url}/{series_id}"

    ws = websocket.WebSocketApp(
        websocket_url,
        on_open=on_open,
        on_message=on_message,
        on_error=on_error,
        on_close=on_close,
    )

    ws.run_forever()
