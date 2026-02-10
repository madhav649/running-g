import { Router } from "express";
import { getCityBootstrap } from "../controllers/cityController";
import { oauthLogin } from "../controllers/authController";
import { captureZone } from "../controllers/captureController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/health", (_req, res) => res.json({ ok: true }));
router.get("/city/bootstrap", getCityBootstrap);
router.post("/auth/oauth", oauthLogin);
router.post("/capture", requireAuth, captureZone);

export default router;
