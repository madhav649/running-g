import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface AuthenticatedRequest extends Request {
  user?: { id: string; teamId: string; email?: string };
}

export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret) as { sub: string; teamId: string; email?: string };
    req.user = { id: payload.sub, teamId: payload.teamId, email: payload.email };
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};
