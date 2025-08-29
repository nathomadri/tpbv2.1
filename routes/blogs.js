import express from "express";
import { isAuthenticated } from "../controllers/auth/authentication.js"; 
import {
  addBlog,
  deleteBlog,
  getSingleBlog,
  getAllBlogs,
  updateBlog,
} from "../controllers/blogs/blogs.js";
import { fetchpost } from "../controllers/blogs/sanity.js";

const router = express.Router();


router.post("/create", isAuthenticated, addBlog);
router.get("/fetch-post", fetchpost)
router.get("/all", getAllBlogs);
router.get("/single/:id", getSingleBlog);
router.get("/:id", getSingleBlog);
router.put("/:id", updateBlog);
router.delete("/:id", deleteBlog);

export default router;
