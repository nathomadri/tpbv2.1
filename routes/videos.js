import express from "express";
import { deleteFixture } from "../controllers/fixtures/fixtures.js";
import { addVideo } from "../controllers/content/videos.js";

const router = express.Router();

// Add video
router.post("/addVideo", addVideo);

// Delete a FixtureupdateFixture by ID
router.delete("/fixture/:id", deleteFixture);

export default router;
