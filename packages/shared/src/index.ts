export interface PolygonGeometry {
  type: "Polygon";
  coordinates: number[][][];
}

export type ZoneTier = "normal" | "high-value" | "landmark";

export interface ZoneState {
  zoneId: string;
  ownerId: string | null;
  teamId: string | null;
  captureTime: string | null;
  pointsGenerated: number;
  zoneTier: ZoneTier;
  h3Index: string;
}

export interface DelhiConfig {
  center: [number, number];
  defaultZoom: number;
  geofence: PolygonGeometry;
  h3Resolution: number;
}

export const DELHI_CENTER: [number, number] = [77.209, 28.6139];

export const LANDMARKS = [
  { name: "Connaught Place", coordinates: [77.2205, 28.6328] as [number, number] },
  { name: "India Gate", coordinates: [77.2295, 28.6129] as [number, number] },
  { name: "Cyber Hub", coordinates: [77.0871, 28.4954] as [number, number] },
  { name: "Hauz Khas", coordinates: [77.1922, 28.5494] as [number, number] },
  { name: "Delhi University", coordinates: [77.1919, 28.6894] as [number, number] },
  { name: "Select Citywalk Mall", coordinates: [77.2197, 28.5284] as [number, number] }
] as const;

export const DELHI_NCR_GEOFENCE: PolygonGeometry = {
  type: "Polygon",
  coordinates: [[
    [76.836, 28.404],
    [77.043, 28.282],
    [77.551, 28.401],
    [77.607, 28.679],
    [77.347, 28.93],
    [76.896, 28.79],
    [76.836, 28.404]
  ]]
};
