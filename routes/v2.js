import express from "express";
import { getClubNews } from "../controllers/blogs/blogs.js";
import { getLeagues, getLeaguesEvents } from "../controllers/betgreen/index.js";
import { getFixtures } from "../controllers/fixtures/fixtures.js";
import { getPosts } from "../controllers/telegram/telegram.js";
import { addUser } from "../services/newsletter/newsletter.js";
import { addVideo, deleteVideo, editVideo, getVideos } from "../controllers/content/videos.js";
import { addPlayer, deletePlayer, editPlayer, getPlayers } from "../controllers/content/players.js";

const router = express.Router();


router.post("/getLeaguesEvents", getLeaguesEvents);

// Content routes
router.use("/content", express.Router()
  .post("/addVideo", addVideo)
  .post("/editVideo", editVideo)
  .post("/deleteVideo", deleteVideo)
  .get("/getVideos", getVideos)

  .post("/addPlayer", addPlayer)
  .post("/editPlayer", editPlayer)
  .post("/deletePlayer", deletePlayer)
  .get("/getPlayers", getPlayers)

);

export default router;
