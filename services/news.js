import axios from "axios";
import Post from "../models/news/Post.js";
import moment from "moment";

// whitelisted country codes
// England - 9, 29-laliga,
// const whitelistedCountries = [9, 29];
const whitelistedCountries = [9];

function parsePublishedAt(publishedAtString) {
  // Parse the date using moment.js
  return moment(publishedAtString, "DD-MM-YYYY HH:mm:ss").toDate();
}

async function fetchAndSaveFootballNews() {
  // Get current date in ISO format
  const currentDate = new Date().toISOString().split("T")[0];

  // API request options
  const options = {
    method: "GET",
    url: "https://football-news11.p.rapidapi.com/api/news-by-date",
    params: {
      date: currentDate,
      lang: "en",
      page: "1",
    },
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY,
      "x-rapidapi-host": "football-news11.p.rapidapi.com",
    },
  };

  try {
    // Fetch news data from API
    const response = await axios.request(options);
    const newsList = response?.data?.result || [];

    // Filter and map posts with whitelisted countries
    // .filter((news) =>
    //   news.countries?.some((countryCode) =>
    //     whitelistedCountries.includes(countryCode)
    //   )
    // )
    const posts = newsList.map((news) => ({
      post_id: news.id,
      title: news.title,
      image: news.image,
      original_url: news.original_url,
      categories: news.categories,
      published_at: parsePublishedAt(news.published_at),
      leagues: news.leagues,
      countries: news.countries,
      posted: false,
    }));

    console.log(
      `Total Fetched ${newsList.length}, Whitelisted countries ${posts.length}`
    );
    // await Post.deleteMany()
    // console.log("deleted <<<<<<<<<<<<<<<<<<<<<<<")

    // Save posts to the database
    for (const post of posts) {
      try {
        // Check if the post already exists
        const existingPost = await Post.findOne({ post_id: post.post_id });
        if (!existingPost) {
          await Post.create(post);
          console.log(`Post with ID ${post.post_id} saved to the database.`);
          // const filtered = post.countries?.some((countryCode) =>
          //   whitelistedCountries.includes(countryCode)
          // );
          // if (filtered) {
          //   // Insert the new post if it doesn't already exist
          //   await Post.create(post);
          //   console.log(`Post with ID ${post.post_id} saved to the database.`);
          // }
        } else {
          console.log(`Post with ID ${post.post_id} already exists. Skipping.`);
        }
      } catch (dbError) {
        console.error(
          `Error saving post with ID ${post.post_id}:`,
          dbError.message
        );
      }
    }
  } catch (apiError) {
    console.error("Error fetching football news:", apiError.message, apiError);
  }
}

export default fetchAndSaveFootballNews;
