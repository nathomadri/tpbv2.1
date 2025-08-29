import express from "express";
import { addUser } from "../services/newsletter/newsletter.js";


const router = express.Router();

router.post("/addUser", addUser)


export default router;
