import express from "express"
import { docss } from "../controllers/home/documentations.js"

const router = express.Router()

router.get('/', docss)

export default router