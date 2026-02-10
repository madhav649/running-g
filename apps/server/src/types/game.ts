import type { ZoneTier } from "@citygrid/shared";

export interface CaptureAttempt {
  playerId: string;
  teamId: string;
  zoneId: string;
  latitude: number;
  longitude: number;
  timestamp: number;
}

export interface ZoneRecord {
  zoneId: string;
  ownerId: string | null;
  teamId: string | null;
  zoneTier: ZoneTier;
  contested: boolean;
  lastCaptureAt: string | null;
}
