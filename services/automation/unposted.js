import axios from "axios";
import Post from "../../models/news/Post.js";
import moment from "moment";

// Countries whitelist
const WHITELISTED_COUNTRIES = [9, 29];

// Helper function to create a delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to get today's date in "DD-MM-YYYY" format
const getTodayDate = () => moment().format("DD-MM-YYYY");

// Helper function to calculate posts per hour
const calculatePostsPerHour = (totalPosts) => {
  const now = moment();
  const hoursRemaining = moment().endOf("day").diff(now, "hours") || 1;
  return Math.ceil(totalPosts / hoursRemaining);
};

// Helper function to send a photo with a caption via Telegram API
const sendTelegramMessage = async (photoUrl, message, retries = 5, delayMs = 1000) => {
  const BASE_URL = `https://api.telegram.org/bot${process.env.THEPITCHBASKET_BOT_API_KEY}/sendPhoto`;
  const parameters = {
    chat_id: process.env.THEPITCHBASKET_CHAT_ID,
    photo: photoUrl,
    caption: message,
    parse_mode: "Markdown",
    disable_web_page_preview: true,
  };

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      await axios.post(BASE_URL, parameters);
      console.log("Message sent successfully.");
      return;
    } catch (error) {
      console.error(`Telegram message send failed (attempt ${attempt + 1} of ${retries}): ${error.message}`);
      if (attempt < retries - 1) await delay(delayMs);
    }
  }

  console.error("Failed to send message after multiple attempts.");
};

// Main function to send unposted football news
const sendUnpostedFootballNews = async () => {
  try {
    const unpostedPosts = await Post.find({ posted: false });

    if (!unpostedPosts.length) {
      console.log("No unposted football news found.");
      return;
    }

    // Get today's date in yyyy-mm-dd format
    const getTodayDate = () => {
      const now = new Date();
      return now.toISOString().split("T")[0];
    };
    const todayDate = getTodayDate();
    console.log("Today's Date:", todayDate);

    // Normalize `published_at` to yyyy-mm-dd and filter posts
    const todayPosts = unpostedPosts.filter((post) => {
      const postDate = new Date(post.published_at).toISOString().split("T")[0];
      console.log(`Post Date: ${postDate}, Today's Date: ${todayDate}`);
      return postDate === todayDate;
    });

    if (!todayPosts.length) {
      console.log("No valid football news posts for today's date.");
      return;
    }

    console.log(`Found ${todayPosts.length} posts for today's date.`);

    // Calculate how many posts to send in this interval
    const calculatePostsPerHour = (totalPosts) => {
      const hoursRemainingInDay = 24 - new Date().getHours();
      return Math.ceil(totalPosts / hoursRemainingInDay);
    };
    const postsPerHour = calculatePostsPerHour(todayPosts.length);
    const postsToSend = todayPosts.slice(0, postsPerHour);

    console.log(
      `Sending ${postsToSend.length} posts. Remaining for today: ${
        todayPosts.length - postsToSend.length
      }.`
    );

    // Send each post
    for (const post of postsToSend) {
      const message = `\n\n\n\n\n📰 *${post.title}*\n\n [👉 👉 Read More](${post.original_url})\n\n\n`;
      await sendTelegramMessage(post.image, message);

      // Mark the post as sent
      await Post.findOneAndUpdate({ post_id: post.post_id }, { posted: true });
      console.log(`Sent football news: ${post.title}`);

      // Wait 1 minute before sending the next post
      await delay(60000);
    }
  } catch (error) {
    console.error("Error sending unposted football news:", error.message, error);
  }
};


export default sendUnpostedFootballNews;
