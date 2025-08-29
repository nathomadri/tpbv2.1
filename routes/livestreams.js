import express from "express";
import {
  createLiveStream,
  getAllLiveStreams,
  getLiveStreamById,
  updateLiveStream, 
  deleteLiveStream, 
} from "../controllers/livestreams/stream.js";

const router = express.Router();

// Get all livestreams
router.get("/v2/streams", getAllLiveStreams);

// Get a single livestream by ID
router.get("/v2/streams/:id", getLiveStreamById);

// Add a new livestream
router.post("/v2/streams", createLiveStream);

// Update an existing livestream by ID
router.put("/v2/streams/:id", updateLiveStream); 

// Delete a livestream by ID
router.delete("/v2/streams/:id", deleteLiveStream); 

export default router;
