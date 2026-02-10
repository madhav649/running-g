import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import type { BootstrapResponse } from "../lib/api";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN ?? "";

interface Props {
  bootstrap: BootstrapResponse;
  latestBattleZone?: string;
}

export const MapView = ({ bootstrap, latestBattleZone }: Props): JSX.Element => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map>();

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: bootstrap.map.style,
      center: bootstrap.map.center,
      zoom: bootstrap.map.zoom,
      pitch: 45,
      antialias: false,
      preserveDrawingBuffer: false
    });

    map.on("load", () => {
      map.addSource("delhi-boundary", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: bootstrap.city.boundary,
          properties: {}
        }
      });

      map.addLayer({
        id: "delhi-boundary-fill",
        type: "fill",
        source: "delhi-boundary",
        paint: { "fill-color": "#2f4f4f", "fill-opacity": 0.2 }
      });

      bootstrap.landmarks.forEach((landmark) => {
        new mapboxgl.Marker({ color: "#ffd60a" })
          .setLngLat(landmark.coordinates)
          .setPopup(new mapboxgl.Popup().setText(`Landmark: ${landmark.name}`))
          .addTo(map);
      });
    });

    mapRef.current = map;
    return () => map.remove();
  }, [bootstrap]);

  useEffect(() => {
    if (!latestBattleZone || !mapRef.current) return;
    mapRef.current.getCanvas().style.boxShadow = "0 0 0 2px #ff3b30 inset";
    const timer = window.setTimeout(() => {
      if (mapRef.current) mapRef.current.getCanvas().style.boxShadow = "";
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [latestBattleZone]);

  return <div className="map-container" ref={mapContainerRef} />;
};
