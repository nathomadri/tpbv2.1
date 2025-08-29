import express from "express";
import {
  
  isAuthenticated,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/auth/authentication.js";

const router = express.Router();

router.post("/register", registerUser);


// router.post("/confirmemail", confirmEmail);
router.post("/login", loginUser);
router.post("/logout", isAuthenticated, logoutUser);


export default router