import { DELHI_NCR_GEOFENCE } from "@citygrid/shared";

export const cityRegistry = {
  delhi: {
    slug: "delhi",
    name: "Delhi NCR",
    center: { lat: 28.6139, lng: 77.209 },
    h3Resolution: 10,
    boundary: DELHI_NCR_GEOFENCE,
    capturePresenceSeconds: 15,
    maxSpeedKmh: 120
  }
} as const;

export type SupportedCity = keyof typeof cityRegistry;
