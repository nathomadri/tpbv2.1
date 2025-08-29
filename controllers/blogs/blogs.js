import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Blog from "../../models/blogs/Blog.js";

dotenv.config();

// add property
export const addBlog = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { title, author, summaryText, paragraphs, club, imageFiles } =
      req.body.blogData;
    // console.log(title, author, summaryText, paragraphs, club)

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const newBlogDoc = new Blog({
      title,
      club,
      summaryText,
      imageFiles,
      paragraphs,
      views: 0,
      user_id: decoded.id,
      author,
    });
    console.log(newBlogDoc);
    await newBlogDoc.save();
    console.log("saved");
    res.status(200).json({ message: "Blog uploaded successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "here again", err: err });
  }
};
// get all properties with pagination
export const getAllBlogs = async (req, res) => {
  try {
    const { pageno = 1, limit = 4 } = req.body;
    const page = parseInt(pageno);
    const blogLimit = parseInt(limit);
    const skip = (page - 1) * blogLimit;

    console.log("fetching all blogs ...");

    const all_blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(blogLimit);

    if (all_blogs.length > 0) {
      console.log(`fetching ${all_blogs.length} blogs status ok`);
      res.status(200).json({ blogs: all_blogs, message: "ok" });
    } else {
      res.status(200).json({ blogs: [], message: "Empty blogs" });
      console.log("fetching 0 blogs status ok");
    }
  } catch (err) {
    console.log("fetching all blogs status failed");
    res.status(500).json(err);
  }
};
export const getClubNews = async (req, res) => {
  try {
    const { pageno = 1, limit = 3, club_name } = req.body;
    const page = parseInt(pageno);
    const blogLimit = parseInt(limit);
    const skip = (page - 1) * blogLimit;

    console.log("fetching club news ...");

    const all_blogs = await Blog.find({ club: club_name })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(blogLimit);

    if (all_blogs.length > 0) {
      res.status(200).json({ club_posts: all_blogs, error: false, code: 0 });
    } else {
      res.status(200).json({ club_posts: [], error: false, code: 0 });
    }
  } catch (err) {
    res.status(200).json({ club_posts: [], error: true, code: 3 });
  }
};

// get landlord  listings
export const getUserBlogs = async (req, res) => {
  // console.log("landlord endpoint hit");
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user_id = jwt.verify(token, process.env.JWT_SECRET_KEY).id;
    const blogs = await Blog.find({ user_id: user_id }).sort({
      createdAt: -1,
    });
    const blog_fetch_response = blogs || "Author has zero blogs";
    res.json(blog_fetch_response);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

export const getSingleBlog = async (req, res) => {
  try {
    const blog_id = req.params.id;
    const blog_doc = await Blog.findById(blog_id);
    if (blog_doc) {
      res.status(200).json({ message: "ok", blog: blog_doc });
    } else {
      res.status(404).json({ message: "Blog not Found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// update property
export const updateBlog = async (req, res) => {
  try {
    const blog_id = req.params.id;

    const updatedBlogData = req.body.blogData;
    const updatedBlog = await Blog.findByIdAndUpdate(blog_id, updatedBlogData, {
      new: true,
    });

    if (updatedBlog) {
      res.status(200).json({ message: "Blog updated" });
    } else {
      res.status(403).json("no blog found");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// delete property
export const deleteBlog = async (req, res) => {
  try {
    const blog_id = req.params.id;
    const blog_deleted = await Blog.findOneAndDelete({ _id: blog_id });
    if (blog_deleted) {
      res.status(200).json({ message: "Blog deleted status 200" });
    } else {
      res.status(404).json({ message: "Blog deleted status 200" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
