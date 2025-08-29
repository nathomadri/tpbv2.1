import { sanityClient } from "../config/sanity.client.js";
import Content from "../models/blogs/Content.js";

// Full GROQ query for posts
const POSTS_QUERY = `
  *[
    _type == "post" && defined(slug.current) &&
    "shabana-news" in categories[]->slug.current
  ] | order(publishedAt desc)[0...1000] {
    _id,
    title,
    slug,
    publishedAt,
    "author": author->name,
    body,
    mainImage {
      asset->{ url },
      alt
    }
  }
`;

export async function fetchAndSaveSanityPosts() {
  try {
    const posts = await sanityClient.fetch(POSTS_QUERY);

    let newCount = 0;
    let updatedCount = 0;

    for (const post of posts) {
      // upsert: insert if not exists, update if exists
      const result = await Content.findByIdAndUpdate(
        post._id,
        post,
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );

      if (result.createdAt.getTime() === result.updatedAt.getTime()) {
        newCount++;
        console.log(`🆕 Inserted new post: ${post.title}`);
      } else {
        updatedCount++;
        console.log(`🔄 Updated post: ${post.title}`);
      }
    }

    console.log(
      `✅ Synced ${posts.length} posts | 🆕 New: ${newCount}, 🔄 Updated: ${updatedCount}`
    );

    return { totalFetched: posts.length, newCount, updatedCount };
  } catch (error) {
    console.error("❌ Error syncing Sanity posts:", error.message);
    throw error;
  }
}
