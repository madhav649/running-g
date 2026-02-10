interface Props {
  status: string;
  battleMessage?: string;
}

export const GameHud = ({ status, battleMessage }: Props): JSX.Element => (
  <section className="hud">
    <h1>CityGrid Delhi</h1>
    <p>{status}</p>
    {battleMessage ? <p className="battle">{battleMessage}</p> : null}
    <ul>
      <li>Landmark zones: 3-5x points</li>
      <li>Capture hold timer: 15s</li>
      <li>Power-ups active: Radar, Shield, Double Points</li>
    </ul>
  </section>
);
