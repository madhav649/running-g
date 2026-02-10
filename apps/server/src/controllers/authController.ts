import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export const oauthLogin = async (req: Request, res: Response): Promise<void> => {
  const { provider, oauthSubject, email, teamId = "free-agent" } = req.body;
  if (!provider || !oauthSubject || !email) {
    res.status(400).json({ error: "provider, oauthSubject and email are required" });
    return;
  }

  const token = jwt.sign(
    {
      sub: oauthSubject,
      teamId,
      email,
      provider
    },
    env.jwtSecret,
    { expiresIn: "8h" }
  );

  res.json({ accessToken: token, tokenType: "Bearer", expiresIn: 28800 });
};
