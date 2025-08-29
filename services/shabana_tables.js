import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Shabanastanding from "../models/sports/Shabanastanding.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seasons = [
  { name: "Premier League 25/26", year: "25/26", editor: false, id: 80653 },
  // { name: "Premier League 24/25", year: "24/25", editor: false, id: 65071 },
  // { name: "Premier League 23/24", year: "23/24", editor: false, id: 53922 },
  // { name: "Premier League 22/23", year: "22/23", editor: false, id: 45686 },
  // { name: "Premier League 21/22", year: "21/22", editor: false, id: 38844 },
  // { name: "Premier League 20/21", year: "20/21", editor: false, id: 34876 },
  // { name: "Premier League 19/20", year: "19/20", editor: false, id: 24023 },
  // { name: "Premier League 2018 / 2019", year: "18/19", editor: false, id: 19876 },
  // { name: "Premier League 2018", year: "2018", editor: false, id: 15858 },
  // { name: "Premier League 2017", year: "2017", editor: false, id: 12921 },
  // { name: "Premier League 2016", year: "2016", editor: false, id: 11265 },
  // { name: "Premier League 2015", year: "2015", editor: false, id: 9841 },
  // { name: "Premier League 2014", year: "2014", editor: false, id: 7752 },
];

async function getShabanaStandingData() {
  for (const season of seasons) {
    const options = {
      method: "GET",
      url: "https://sofascore.p.rapidapi.com/tournaments/get-standings",
      params: { tournamentId: "1644", seasonId: season.id },
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_SOFASCORE_KEY,
        "x-rapidapi-host": "sofascore.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      const standings = response.data.standings;

      if (standings && standings.length > 0) {
        const standingsId = standings[0].id;

        const exists = await Shabanastanding.findOne({ standings_id: standingsId });

        if (!exists) {
          const newDoc = new Shabanastanding({
            season_id: season.id,
            season_name: season.name,
            season_year: season.year,
            standings_id: standingsId,
            standings: standings[0],
          });
          await newDoc.save();
          console.log(`✅ Saved standings for ${season.name}`);
        } else {
          exists.standings = standings[0];
          await exists.save();
          console.log(`♻️ Updated standings for ${season.name}`);
        }
      } else {
        console.warn(`⚠️ No standings found for ${season.name}`);
      }
    } catch (error) {
      console.error(`❌ Error fetching standings for ${season.name}:`, error.message);
    }
  }
}


export default getShabanaStandingData;
//
