import axios from "axios";
import moment from "moment";
import Fixture from "../../models/fixtures/Fixtures.js";

// Helper function to create a delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Send message (text or photo) via Telegram
const sendTelegramMessage = async (
  photoUrl,
  message,
  retries = 5,
  delayMs = 1000
) => {
  const chat_id = process.env.SHABANANATION_CHAT_ID;
  const BOT_API_KEY = process.env.SHABANANATION_BOT_API_KEY;

  const isPhoto = !!photoUrl;
  const endpoint = isPhoto
    ? `https://api.telegram.org/bot${BOT_API_KEY}/sendPhoto`
    : `https://api.telegram.org/bot${BOT_API_KEY}/sendMessage`;

  const parameters = {
    chat_id,
    parse_mode: "Markdown",
    disable_web_page_preview: true,
    ...(isPhoto ? { photo: photoUrl, caption: message } : { text: message }),
  };

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      await axios.post(endpoint, parameters);
      console.log("Message sent successfully.");
      return;
    } catch (error) {
      console.error(
        `Telegram message send failed (attempt ${attempt + 1}): ${
          error.message
        }`
      );
      if (attempt < retries - 1) await delay(delayMs);
    }
  }

  console.error("Failed to send message after multiple attempts.");
};

// Send Telegram Poll
const sendTelegramPoll = async (
  question,
  options,
  retries = 5,
  delayMs = 1000
) => {
  const BASE_URL = `https://api.telegram.org/bot${process.env.SHABANANATION_BOT_API_KEY}/sendPoll`;

const parameters = {
  chat_id: process.env.SHABANANATION_CHAT_ID,
  question,
  options,
  allows_multiple_answers: false,
  type: "regular",
};


  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      console.log("Sending poll with:", parameters);
      await axios.post(BASE_URL, parameters, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Poll sent successfully.");
      return;
    } catch (error) {
      console.error(
        `Poll send failed (attempt ${attempt + 1}): ${
          error.response?.data?.description || error.message
        }`
      );
      if (attempt < retries - 1) await delay(delayMs);
    }
  }

  console.error("Failed to send poll after multiple attempts.");
};

// Main function to send match alert and poll
const sendShabananation = async () => {
  try {
    const matches = await Fixture.find();
    const sortedMatches = matches.sort(
      (a, b) => a.kickoffDateTime - b.kickoffDateTime
    );
    const nextMatch = sortedMatches.length ? sortedMatches[0] : null;

    if (nextMatch) {
      // Parse the kickoff Unix timestamp (in seconds) and convert to local time
      const matchDate = moment.unix(nextMatch.kickoffDateTime).local();

      // Check if the match is tomorrow relative to the current local time
      const tomorrow = moment().add(1, "day");
      let heading = matchDate.isSame(tomorrow, "day")
        ? "🚨 Tomorrow’s Big Match!"
        : "📣 Upcoming Fixture!";

      // Format the date and time
      const formattedDate = matchDate.format("dddd, MMMM Do YYYY");
      const formattedTime = matchDate.format("h:mm A");

      const message = `
${heading}

⚽ *${nextMatch.homeTeam}* vs *${nextMatch.awayTeam}*
📅 *Date:* ${formattedDate}
🕒 *Time:* ${formattedTime}
🏟️ *Venue:* ${nextMatch.stadium || "TBA"}

🔥 Stay tuned for live updates!
`.trim();

      await sendTelegramMessage(null, message); // no image
      await delay(2000); // Wait for 2 seconds before sending the next message
      // Send poll immediately afterward
      await sendTelegramPoll("Who will win?", [
        nextMatch.homeTeam || "Team A",
        nextMatch.awayTeam || "Team B",
        "Draw",
      ]);
    } else {
      console.log("No upcoming matches found.");
    }
  } catch (error) {
    console.error("Error sending match alert:", error.message, error);
  }
};
const analyzeShabanaStats = async () => {
  try {
    const fixtures = await Fixture.find({
      $or: [
        { homeTeam: /shabana/i },
        { awayTeam: /shabana/i }
      ],
      home_final_scores: { $ne: null },
      away_final_scores: { $ne: null }
    });

    let played = 0;
    let wins = 0;
    let draws = 0;
    let losses = 0;
    let goalsFor = 0;
    let goalsAgainst = 0;
    let opponents = {};

    for (let match of fixtures) {
      const isHome = /shabana/i.test(match.homeTeam);
      const isAway = /shabana/i.test(match.awayTeam);

      const homeScore = parseInt(match.home_final_scores);
      const awayScore = parseInt(match.away_final_scores);

      if (isNaN(homeScore) || isNaN(awayScore)) continue;

      played++;

      const opponent = isHome ? match.awayTeam : match.homeTeam;
      opponents[opponent] = (opponents[opponent] || 0) + 1;

      const shabanaGoals = isHome ? homeScore : awayScore;
      const opponentGoals = isHome ? awayScore : homeScore;

      goalsFor += shabanaGoals;
      goalsAgainst += opponentGoals;

      if (shabanaGoals > opponentGoals) wins++;
      else if (shabanaGoals === opponentGoals) draws++;
      else losses++;
    }

    const mostPlayedOpponent = Object.entries(opponents).sort((a, b) => b[1] - a[1])[0];

    const summary = `
📊 *Shabana FC Historical Stats*

🧮 Total Matches: ${played}
✅ Wins: ${wins}
🤝 Draws: ${draws}
❌ Losses: ${losses}

⚽ Goals For: ${goalsFor}
🥅 Goals Against: ${goalsAgainst}
📈 Win Rate: ${(wins / played * 100).toFixed(1)}%
🧮 Avg Goals per Game: ${(goalsFor / played).toFixed(2)}

🆚 Most Played Opponent: ${mostPlayedOpponent?.[0]} (${mostPlayedOpponent?.[1]} times)

#ShabanaFC #StatsZone
    `.trim();

    await sendTelegramMessage(null, summary);
  } catch (err) {
    console.error("Error analyzing stats:", err.message);
  }
};

export {analyzeShabanaStats,sendShabananation};
