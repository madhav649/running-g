import express from "express";
import http from "node:http";
import cors from "cors";
import helmet from "helmet";
import { Server } from "socket.io";
import routes from "./routes";
import { env } from "./config/env";
import { registerGameSocket, emitZoneUpdate } from "./sockets/gameSocket";
import { startCaptureWorker } from "./workers/queue";

const app = express();
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use("/api", routes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  },
  transports: ["websocket"]
});

registerGameSocket(io);

startCaptureWorker(async ({ zoneId, teamId, isLandmark }) => {
  emitZoneUpdate(io, {
    city: "delhi",
    zoneId,
    teamId,
    contested: true,
    isLandmark
  });
});

server.listen(env.port, () => {
  console.log(`CityGrid API running on ${env.port}`);
});
