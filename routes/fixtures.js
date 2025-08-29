import express from "express";
import {  createFixture, deleteFixture, getallFixtures, getAllFixtures, getComingupFixture, getFixtureById, getlastmatchResult, getResults, getStandings, updateFixture, updateResult } from "../controllers/fixtures/fixtures.js";


const router = express.Router();

// Get all livestreams
router.get("/fixture", getAllFixtures);
router.get("/standings", getStandings);
router.get("/getAllFixtures", getallFixtures);
router.get("/results", getResults);
router.get("/lastmatch", getlastmatchResult);

router.get("/comingup", getComingupFixture);


// Get a single livestream by ID
router.get("/fixture/:id", getFixtureById);

// Add a new livestream
router.post("/fixture", createFixture);

// Update an existing livestream by ID
router.put("/fixture/:id", updateFixture); 
router.put("/result/:id", updateResult); 

// Delete a FixtureupdateFixture by ID
router.delete("/fixture/:id", deleteFixture); 




export default router;
