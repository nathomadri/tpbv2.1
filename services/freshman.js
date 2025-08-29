import Post from "../models/news/Post.js";

async function deleteOldPosts() {
  try {
    // Calculate the timestamp for one day ago
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    // Find and delete posts older than one day
    const result = await Post.deleteMany({ published_at: { $lt: oneDayAgo } });

    console.log(`${result.deletedCount} posts older than one day were deleted.`);
  } catch (error) {
    console.error("Error deleting old posts:", error.message);
  }
}

export default deleteOldPosts;
