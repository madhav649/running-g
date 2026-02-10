import { useEffect } from "react";
import { io } from "socket.io-client";

export const useGameSocket = (
  onZoneUpdate: (payload: { zoneId: string; teamId: string; contested: boolean; isLandmark: boolean }) => void,
  onLandmarkBattle: (payload: { zoneId: string; message: string }) => void
): void => {
  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL ?? "http://localhost:4000", { transports: ["websocket"] });
    socket.emit("subscribe:city", "delhi");

    socket.on("zone:update", onZoneUpdate);
    socket.on("battle:landmark", onLandmarkBattle);

    return () => {
      socket.off("zone:update", onZoneUpdate);
      socket.off("battle:landmark", onLandmarkBattle);
      socket.disconnect();
    };
  }, [onLandmarkBattle, onZoneUpdate]);
};
