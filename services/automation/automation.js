import cron from "node-cron";
import dotenv from "dotenv";
import fetchAndSaveFootballNews from "../news.js";
import { get3rdData, cleanData, get3rdDataLast, get3rdDataNext } from "../3rd.js";
import getShabanaStandingData from "../shabana_tables.js";

import sendUnpostedFootballNews from "./unposted.js";
import deleteOldPosts from "../freshman.js";

import { fetchAndSaveSanityPosts } from "../content.js"

dotenv.config();
// Function to schedule EPL fixture posts
function scheduleEPLPosts() {
  // sendShabananation();
// fetchAndSaveSanityPosts();
  // SANITY posts
  cron.schedule("0 */12 * * *", () => {
    console.log("Fetching and saving football news...");
    fetchAndSaveSanityPosts();
  });

  // fetchAndSaveFootballNews();
  cron.schedule("0 */12 * * *", () => {
    console.log("Fetching and saving football news...");
    fetchAndSaveFootballNews();
  });
  // cleanData();
  // get3rdData()
  cron.schedule("0 */12 * * *", () => {
    console.log("Fetching and saving shabana data...");
    get3rdDataLast()
    // get3rdDataNext()
    get3rdData();
  });
  //  getShabanaStandingData();
  cron.schedule("0 */12 * * *", () => {
    console.log("Fetching and saving shabana data...");
    getShabanaStandingData();
  });
  // cron.schedule("0 19 * * *", () => {
  //   console.log("🔥 Posting Shabana stats when fans are online...");
  //   analyzeShabanaStats();
  // });

  // sendUnpostedFootballNews()
  cron.schedule("0 */4 * * *", () => {
    console.log("Sending unposted football news...");
    sendUnpostedFootballNews();
  });
  // deleteOldPosts()
  cron.schedule("0 0 * * *", () => {
    console.log("Deleting posted football news...");
    deleteOldPosts();
  });

  console.log("Cron jobs for football news scheduled every 3 hours.");
}

export default scheduleEPLPosts;
