import express from "express";
import { getAds } from "../controllers/ads/ads.js";

const router = express.Router();

router.get("/content", getAds);

export default router;
