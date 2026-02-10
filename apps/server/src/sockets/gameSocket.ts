import type { Server } from "socket.io";

export const registerGameSocket = (io: Server): void => {
  io.on("connection", (socket) => {
    socket.on("subscribe:city", (city: string) => {
      socket.join(`city:${city}`);
    });

    socket.on("subscribe:team", (teamId: string) => {
      socket.join(`team:${teamId}`);
    });
  });
};

export const emitZoneUpdate = (
  io: Server,
  payload: { city: string; zoneId: string; teamId: string; contested: boolean; isLandmark: boolean }
): void => {
  io.to(`city:${payload.city}`).emit("zone:update", payload);
  if (payload.isLandmark) {
    io.to(`city:${payload.city}`).emit("battle:landmark", {
      zoneId: payload.zoneId,
      teamId: payload.teamId,
      message: "Landmark battle started"
    });
  }
};
