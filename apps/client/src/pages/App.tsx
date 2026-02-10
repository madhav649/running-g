import { useCallback, useEffect, useState } from "react";
import { fetchBootstrap, type BootstrapResponse } from "../lib/api";
import { MapView } from "../components/MapView";
import { GameHud } from "../components/GameHud";
import { useGameSocket } from "../hooks/useGameSocket";

export const App = (): JSX.Element => {
  const [bootstrap, setBootstrap] = useState<BootstrapResponse | null>(null);
  const [status, setStatus] = useState("Loading Delhi game grid...");
  const [battleMessage, setBattleMessage] = useState<string>();
  const [latestBattleZone, setLatestBattleZone] = useState<string>();

  useEffect(() => {
    fetchBootstrap()
      .then((data) => {
        setBootstrap(data);
        setStatus("Live in Delhi NCR. Move to capture zones.");
      })
      .catch(() => setStatus("Could not load map bootstrap."));
  }, []);

  const handleZoneUpdate = useCallback((payload: { zoneId: string; teamId: string; contested: boolean; isLandmark: boolean }) => {
    setStatus(`Zone ${payload.zoneId.slice(0, 8)} contested by team ${payload.teamId}`);
    if (payload.isLandmark) {
      setLatestBattleZone(payload.zoneId);
    }
  }, []);

  const handleLandmarkBattle = useCallback((payload: { zoneId: string; message: string }) => {
    setBattleMessage(`${payload.message}: ${payload.zoneId.slice(0, 8)}`);
    setLatestBattleZone(payload.zoneId);
  }, []);

  useGameSocket(handleZoneUpdate, handleLandmarkBattle);

  return (
    <main className="app-shell">
      <GameHud status={status} battleMessage={battleMessage} />
      {bootstrap ? <MapView bootstrap={bootstrap} latestBattleZone={latestBattleZone} /> : null}
    </main>
  );
};
