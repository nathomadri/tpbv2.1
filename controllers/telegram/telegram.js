import Post from "../../models/news/Post.js";

export const getPosts = async (req, res) => {
    try {
        // Get today's date
        const today = new Date();
        // Create a date range for today's posts
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        // Find posts published today
        const posts = await Post.find({
            published_at: {
                $gte: startOfDay,
                $lte: endOfDay,
            },
            posted:true
        });

        res.status(200).json({ posts:posts.slice(0,20), message: "success" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
