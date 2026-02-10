import type { Request, Response } from "express";
import { cityRegistry } from "../config/delhi";
import { LANDMARKS } from "@citygrid/shared";

export const getCityBootstrap = (_req: Request, res: Response): void => {
  const delhi = cityRegistry.delhi;

  res.json({
    city: delhi,
    landmarks: LANDMARKS,
    map: {
      provider: "mapbox",
      center: [delhi.center.lng, delhi.center.lat],
      zoom: 11.8,
      style: "mapbox://styles/mapbox/dark-v11"
    }
  });
};
