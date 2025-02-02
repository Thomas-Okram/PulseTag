import express from "express";
import { trackEvent } from "../controllers/analytics.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/track", verifyToken, trackEvent);

export default router;
