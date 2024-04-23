import { WebSocketServer } from "ws";

import { wsPath, wsPort } from "../config/config";
import { sendCurse } from "./helpers/changeCoinsCurse";
import { observer } from "./helpers/observer";

const wss = new WebSocketServer({
  path: wsPath,
  port: wsPort,
});

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);
  const cb = (msg: string) => ws.send(msg);
  observer.subscribe(cb);
  sendCurse();
  ws.on("close", () => {
    observer.unsubscribe(cb);
    console.log("Client disconnected");
  });
});
