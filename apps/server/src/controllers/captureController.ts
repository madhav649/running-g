import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth";
import { assertWithinDelhi, zoneForPosition } from "../services/geo";
import { isImpossibleTravel, looksSpoofed } from "../services/antiCheat";
import { enqueueCaptureEvent } from "../workers/queue";

const lastPositions = new Map<string, { latitude: number; longitude: number; timestamp: number }>();

export const captureZone = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { latitude, longitude, timestamp, accuracyMeters = 10, mockedProvider = false } = req.body;
  if (!assertWithinDelhi(latitude, longitude)) {
    res.status(400).json({ error: "Location is outside Delhi NCR geofence." });
    return;
  }

  const previous = lastPositions.get(req.user.id);
  const current = { latitude, longitude, timestamp };

  if (previous && isImpossibleTravel(previous, current)) {
    res.status(403).json({ error: "Impossible travel speed detected." });
    return;
  }

  if (looksSpoofed(accuracyMeters, mockedProvider)) {
    res.status(403).json({ error: "Suspicious GPS signal detected." });
    return;
  }

  lastPositions.set(req.user.id, current);

  const zoneId = zoneForPosition(latitude, longitude);
  await enqueueCaptureEvent({
    playerId: req.user.id,
    teamId: req.user.teamId,
    zoneId,
    latitude,
    longitude,
    timestamp
  });

  res.json({ status: "queued", zoneId });
};
