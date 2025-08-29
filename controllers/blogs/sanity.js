import Content from "../../models/blogs/Content.js";
import CryptoJS from "crypto-js";

export const fetchpost = async (req, res) => {
  try {
    const { slug } = req.query;

    let posts;
    if (slug) {
      posts = await Content.find({ "slug.current": slug });
    } else {
      posts = await Content.find().sort({ createdAt: -1 });
    }
  const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(posts),
      process.env.SECRET_KEY
    ).toString();

    res.status(200).json({ data:encryptedData });
  } catch (error) {
    console.error("Sanity fetch error:", error);
    res.status(500).json({ error: "Failed to fetch teaser news" });
  }
};