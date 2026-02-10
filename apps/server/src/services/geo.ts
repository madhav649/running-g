import { latLngToCell, gridDisk } from "h3-js";
import { DELHI_NCR_GEOFENCE, LANDMARKS, type PolygonGeometry } from "@citygrid/shared";

const pointInPolygon = (lat: number, lng: number, polygon: PolygonGeometry): boolean => {
  const coords = polygon.coordinates[0];
  let inside = false;
  for (let i = 0, j = coords.length - 1; i < coords.length; j = i++) {
    const [xi, yi] = coords[i];
    const [xj, yj] = coords[j];
    const intersects = ((yi > lat) !== (yj > lat)) && (lng < (xj - xi) * (lat - yi) / ((yj - yi) || 1e-12) + xi);
    if (intersects) inside = !inside;
  }
  return inside;
};

export const assertWithinDelhi = (lat: number, lng: number): boolean => pointInPolygon(lat, lng, DELHI_NCR_GEOFENCE);

export const zoneForPosition = (lat: number, lng: number, resolution = 10): string => latLngToCell(lat, lng, resolution);

export const nearbyZones = (h3Index: string, radius = 2): string[] => gridDisk(h3Index, radius);

export const landmarkZoneIds = (resolution = 10): string[] => LANDMARKS.map((l) => latLngToCell(l.coordinates[1], l.coordinates[0], resolution));
