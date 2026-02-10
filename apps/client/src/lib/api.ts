export interface BootstrapResponse {
  city: {
    slug: string;
    name: string;
    center: { lat: number; lng: number };
    boundary: { type: "Polygon"; coordinates: number[][][] };
    h3Resolution: number;
  };
  landmarks: Array<{ name: string; coordinates: [number, number] }>;
  map: {
    provider: "mapbox";
    center: [number, number];
    zoom: number;
    style: string;
  };
}

export const fetchBootstrap = async (): Promise<BootstrapResponse> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL ?? "http://localhost:4000"}/api/city/bootstrap`);
  if (!response.ok) throw new Error("Failed to load city bootstrap");
  return response.json() as Promise<BootstrapResponse>;
};
