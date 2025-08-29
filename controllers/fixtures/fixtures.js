import LeagueEvents from "../../models/betgreen/sportsbook/events/LeagueEvents.js";
import Fixture from "../../models/fixtures/Fixtures.js";
// import Shabanastanding from "../../models/sports/Shabanastanding.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import Result from "../../models/fixtures/Results.js";
import CryptoJS from "crypto-js";
import Joi from "joi";
import Shabanastanding from "../../models/sports/Shabanastanding.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.resolve(__dirname, "../../json-db/fixtures.json");
const filePathStandings = path.resolve(
  __dirname,
  "../../json-db/shabana-standing.json"
);

const data = fs.readFileSync(filePath, "utf-8");
const data_standings = fs.readFileSync(filePathStandings, "utf-8");
const allStandings =
  (data_standings.length > 0 && JSON.parse(data_standings)) || [];
const allFixtures = JSON.parse(data);

export const getFixtures = async (req, res) => {
  try {
    console.log("leagues fetching");
    const data_ = await LeagueEvents.find();
    let toShip = [];
    const nowInSeconds = Math.floor(Date.now() / 1000); // Current time in seconds (UTC)

    if (data_.length > 0) {
      data_.forEach((element) => {
        if (element.leagueName === "England - Premier League") {
          //   console.log(`Processing league: ${element.leagueName}`);
          // Log each event's start time for verification
          const filteredEvents = element.leagueEventsData.filter((event) => {
            const eventStartInSeconds = Math.floor(
              new Date(event.starts).getTime() / 1000
            );
            return eventStartInSeconds >= nowInSeconds;
          });

          //   console.log(`Filtered events count: ${filteredEvents.length}`);
          if (filteredEvents.length > 0) {
            toShip.push({
              ...element,
              leagueEventsData: filteredEvents,
            });
          }
        }
      });
    }

    if (toShip.length > 0) {
      res.status(200).json({
        data: toShip,
        message: "success",
        error: false,
      });
    } else {
      res.status(200).json({
        data: [],
        message: "No upcoming events found.",
        error: false,
      });
    }
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
};

// Define the validation schema for a fixture
const fixtureSchema = Joi.object({
  videoStreamLink: Joi.string().uri(),
  kickoffDateTime: Joi.string(),
  stadium: Joi.string(),
  tickets: Joi.string(),
  presented_by: Joi.string(),
  referee: Joi.string(),
  competition: Joi.string(),
  status: Joi.string(),
  homeTeam: Joi.string(),
  awayTeam: Joi.string(),
  home_final_scores: Joi.string(),
  away_final_scores: Joi.string(),
});

export const createFixture = async (req, res) => {
  // Validate the request body
  const { error } = fixtureSchema.validate(req.body);

  console.log(error);
  if (error) {
    return res
      .status(400)
      .json({ message: "Validation error", details: error.details });
  }

  try {
    const newFixture = new Fixture(req.body);
    await newFixture.save();
    res.status(201).json(newFixture);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating fixture", error: error.message });
  }
};

export const getAllFixtures = async (req, res) => {
  try {
    const currentTimestamp = Math.floor(Date.now() / 1000); // Get current time in seconds

    // Query only upcoming fixtures directly in MongoDB
    const fixtures = await Fixture.find({
      kickoffDateTime: { $gte: String(currentTimestamp) }, // Ensure string comparison
    }).sort({ kickoffDateTime: 1 });
    const filteredMatches = fixtures
      .filter((match) => {
        const matchTimestamp = Number(match.kickoffDateTime);
        return !isNaN(matchTimestamp) && matchTimestamp >= currentTimestamp;
      })
      .sort((a, b) => a.kickoffDateTime - b.kickoffDateTime);
    // Encrypt the response data
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(filteredMatches),
      process.env.SECRET_KEY
    ).toString();

    res.status(200).json({ message: "success", encryptedData });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching fixtures", error: error.message });
  }
};

export const getStandings = async (req, res) => {
  try {
    const currentTimestamp = Math.floor(Date.now() / 1000); // Get current time in seconds

    // Query only upcoming fixtures directly in MongoDB
    const fixtures = await Shabanastanding.find();
    if (fixtures) {
      // Encrypt the response data
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(fixtures[0]),
        process.env.SECRET_KEY
      ).toString();
      // console.log(fixtures[0]);
      res.status(200).json({ message: "success", standings: encryptedData });
    } else {
      res.status(200).json({ message: "success", standings: {} });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching fixtures", error: error.message });
  }
};

export const getallFixtures = async (req, res) => {
  try {
    const { start, end, page = 1, limit = 10 } = req.query;
    const query = {};

    if (start && end) {
      // Convert start and end to numbers for proper comparison
      const startTimestamp = Number(start);
      const endTimestamp = Number(end);

      if (!isNaN(startTimestamp) && !isNaN(endTimestamp)) {
        query.kickoffDateTime = {
          $gte: startTimestamp,
          $lte: endTimestamp,
        };
      }
    } else {
      const currentTimestamp = Math.floor(Date.now() / 1000); // Get current UNIX timestamp (in seconds)
      query.kickoffDateTime = { $gte: currentTimestamp };
    }

    const fixtures = await Fixture.find(query) // Apply query filter
      .sort({ kickoffDateTime: 1 }) // Sort by earliest match first
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    // Encrypt the response data
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(fixtures),
      process.env.SECRET_KEY
    ).toString();

    res.status(200).json({
      message: "success",
      encryptedData,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching fixtures",
      error: error.message,
    });
  }
};

export const getResults = async (req, res) => {
  try {
    const currentTimestamp = Math.floor(Date.now() / 1000);

    // Fetch the most recent past match where status.description = "Ended"
    const latestResult = await Fixture.find({
      "status.description": "Ended",
      kickoffDateTime: { $lt: currentTimestamp }, // only past matches
    }).sort({ kickoffDateTime: -1 });

    if (!latestResult) {
      return res.status(200).json({ message: "success", encryptedData: [] });
    }

    // Encrypt the response data
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(latestResult),
      process.env.SECRET_KEY
    ).toString();

    res.status(200).json({ message: "success", encryptedData });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching past matches",
      error: error.message,
    });
  }
};

export const getlastmatchResult = async (req, res) => {
  try {
    const currentTimestamp = Math.floor(Date.now() / 1000);

    // Fetch only the most recent past match
    const latestResult = await Fixture.find({ status: "Ended" }).sort({
      kickoffDateTime: -1,
    });
    if (!latestResult) {
      return res.status(200).json({ message: "success", encryptedData: null });
    }
    const latestResult2 = latestResult.filter(
      (i) => i.home_final_scores && i.away_final_scores
    );
    // Encrypt the response data
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(latestResult2[0]),
      process.env.SECRET_KEY
    ).toString();

    res.status(200).json({ message: "success", encryptedData });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching past matches",
      error: error.message,
    });
  }
};

// export const getComingupFixture = async (req, res) => {
//   try {
//     const currentTimestamp = Math.floor(Date.now() / 1000); // Current UNIX timestamp (in seconds)

//     // Fetch fixtures and convert kickoffDateTime to a number
//     const nextFixture = await Fixture.find()
//       .sort({ kickoffDateTime: 1 }) // Sort by earliest match
//       .limit(10); // Fetch more and filter in JS if needed

//     // Filter fixtures where kickoffDateTime is a valid timestamp and greater than now
//     const filteredMatches = nextFixture.filter(match => {
//       const matchTimestamp = Number(match.kickoffDateTime); // Convert string to number
//       return !isNaN(matchTimestamp) && matchTimestamp >= currentTimestamp;
//     });

//     // Encrypt response data
//     const encryptedData = CryptoJS.AES.encrypt(
//       JSON.stringify(filteredMatches?.slice(0, 1)), // Get only the first upcoming match
//       process.env.SECRET_KEY
//     ).toString();

//     res.status(200).json({ message: "success", encryptedData });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error fetching upcoming fixture",
//       error: error.message,
//     });
//   }
// };

export const getComingupFixture = async (req, res) => {
  try {
    const currentTimestamp = Math.floor(Date.now() / 1000);

    // Resolve path relative to this file, not cwd

    // Filter for upcoming fixtures
    const filteredMatches = allFixtures
      .filter((match) => {
        const matchTimestamp = Number(match.kickoffDateTime);
        return !isNaN(matchTimestamp) && matchTimestamp >= currentTimestamp;
      })
      .sort((a, b) => a.kickoffDateTime - b.kickoffDateTime);

    // Encrypt the first upcoming fixture
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(filteredMatches.slice(0, 1)),
      process.env.SECRET_KEY
    ).toString();

    res.status(200).json({ message: "success", encryptedData });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching upcoming fixture",
      error: error.message,
    });
  }
};

// Function to get a single fixture by ID
export const getFixtureById = async (req, res) => {
  try {
    const fixture = await Fixture.findById(req.params.id);
    if (!fixture) {
      return res.status(404).json({ message: "Fixture not found" });
    }
    res.status(200).json(fixture);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching fixture", error: error.message });
  }
};

// Update an existing fixture
export const updateFixture = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const fixture = await Fixture.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (!fixture) {
      return res.status(404).json({ message: "Fixture not found" });
    }
    res.status(200).json(fixture);
  } catch (error) {
    console.error("Error updating fixture:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const updateResult = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const result = await Result.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (!result) {
      return res.status(404).json({ message: "Fixture not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error("Error updating result:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a fixture
export const deleteFixture = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedFixture = await Fixture.findByIdAndDelete(id);
    if (!deletedFixture) {
      return res.status(404).json({ message: "Fixture not found" });
    }
    res.status(200).json({ message: "Fixture deleted successfully" });
  } catch (error) {
    console.error("Error deleting fixture:", error);
    res.status(500).json({ message: "Server error" });
  }
};
