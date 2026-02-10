interface LocationPing {
  latitude: number;
  longitude: number;
  timestamp: number;
}

const toRadians = (value: number): number => (value * Math.PI) / 180;

const distanceKm = (a: LocationPing, b: LocationPing): number => {
  const dLat = toRadians(b.latitude - a.latitude);
  const dLng = toRadians(b.longitude - a.longitude);
  const lat1 = toRadians(a.latitude);
  const lat2 = toRadians(b.latitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
};

export const isImpossibleTravel = (previous: LocationPing, current: LocationPing, maxSpeedKmh = 120): boolean => {
  const hours = Math.max((current.timestamp - previous.timestamp) / 3_600_000, 1 / 3_600_000);
  const speed = distanceKm(previous, current) / hours;
  return speed > maxSpeedKmh;
};

export const looksSpoofed = (accuracyMeters: number, mockedProvider: boolean): boolean => mockedProvider || accuracyMeters > 75;
