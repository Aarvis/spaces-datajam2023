import { WebSocket } from "ws";

const BASE_URL = "ws://localhost:8080";

const SERIES_ID = 2579089;

const WS_URL = `${BASE_URL}/${SERIES_ID}`;

const ws = new WebSocket(WS_URL);

ws.onopen = () => {
  console.log("Connected to WebSocket server.");
};

ws.onclose = (event) => {
  console.log("Disconnected from WebSocket server: ", event.reason);
};

ws.onmessage = (event) => {
  const object = JSON.parse(event.data);

  console.log(object);
};

ws.onerror = (error) => {
  console.error("WebSocket error:", error);
};
