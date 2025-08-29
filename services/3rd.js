import axios from "axios";
import Fixture from "../models/fixtures/Fixtures.js";
import dotenv from "dotenv";
import moment from "moment-timezone";

dotenv.config();
// full


async function get3rdDataLast() {
  let pageIndex = 0;
  let hasNextPage = true;

  try {
    while (hasNextPage) {
      const options = {
        method: "GET",
        url: "https://sofascore.p.rapidapi.com/teams/get-last-matches",
        params: {
          teamId: "332880", // Shabana FC
          pageIndex: pageIndex.toString(),
        },
        headers: {
          "x-rapidapi-key": process.env.RAPIDAPI_SOFASCORE_KEY,
          "x-rapidapi-host": "sofascore.p.rapidapi.com",
        },
      };

      const response = await axios.request(options);
      const matches = response.data;
      hasNextPage = matches?.hasNextPage;

      if (matches?.events?.length) {
        for (const match of matches.events) {
          const mappedFixture = {
            sp_match_id: match.id?.toString(),
            kickoffDateTime: match.startTimestamp,
            customId: match.customId || null,
            tournament: {
              id: match.tournament?.id,
              name: match.tournament?.name,
              slug: match.tournament?.slug,
              category: {
                id: match.tournament?.category?.id,
                name: match.tournament?.category?.name,
                slug: match.tournament?.category?.slug,
                alpha2: match.tournament?.category?.alpha2,
              },
              uniqueTournament: {
                id: match.tournament?.uniqueTournament?.id,
                name: match.tournament?.uniqueTournament?.name,
                slug: match.tournament?.uniqueTournament?.slug,
                primaryColorHex: match.tournament?.uniqueTournament?.primaryColorHex,
                secondaryColorHex: match.tournament?.uniqueTournament?.secondaryColorHex,
              },
            },

            season: {
              id: match.season?.id,
              name: match.season?.name,
              year: match.season?.year,
            },
            roundInfo: {
              round: match.roundInfo?.round,
              name: match.roundInfo?.name,
            },

            homeTeam: {
              id: match.homeTeam?.id,
              name: match.homeTeam?.name,
              slug: match.homeTeam?.slug,
              shortName: match.homeTeam?.shortName,
              gender: match.homeTeam?.gender,
              nameCode: match.homeTeam?.nameCode,
              country: {
                name: match.homeTeam?.country?.name,
                alpha2: match.homeTeam?.country?.alpha2,
                alpha3: match.homeTeam?.country?.alpha3,
                slug: match.homeTeam?.country?.slug,
              },
              teamColors: {
                primary: match.homeTeam?.teamColors?.primary,
                secondary: match.homeTeam?.teamColors?.secondary,
                text: match.homeTeam?.teamColors?.text,
              },
            },
            awayTeam: {
              id: match.awayTeam?.id,
              name: match.awayTeam?.name,
              slug: match.awayTeam?.slug,
              shortName: match.awayTeam?.shortName,
              gender: match.awayTeam?.gender,
              nameCode: match.awayTeam?.nameCode,
              country: {
                name: match.awayTeam?.country?.name,
                alpha2: match.awayTeam?.country?.alpha2,
                alpha3: match.awayTeam?.country?.alpha3,
                slug: match.awayTeam?.country?.slug,
              },
              teamColors: {
                primary: match.awayTeam?.teamColors?.primary,
                secondary: match.awayTeam?.teamColors?.secondary,
                text: match.awayTeam?.teamColors?.text,
              },
            },

            status: {
              code: match.status?.code,
              description: match.status?.description,
              type: match.status?.type,
            },
            homeScore: {
              current: match.homeScore?.current,
              display: match.homeScore?.display,
            },
            awayScore: {
              current: match.awayScore?.current,
              display: match.awayScore?.display,
            },

            stadium: match.venue?.stadium || null,
            referee: match.referee || null,
            tickets: match.tickets || null,
            videoStreamLink: null,
            presented_by: "RAPTOR",
          };

          // UPSERT with insert/update detection
          const result = await Fixture.findOneAndUpdate(
            {
              sp_match_id: mappedFixture.sp_match_id,
              "homeTeam.name": mappedFixture.homeTeam?.name,
              "awayTeam.name": mappedFixture.awayTeam?.name,
            },
            { $set: mappedFixture },
            { new: true, upsert: true, rawResult: true }
          );
          if (result.lastErrorObject?.upserted) {
            console.log(
              `🆕 Inserted match: ${mappedFixture.homeTeam?.name} vs ${mappedFixture.awayTeam?.name}`
            );
          } else if (result.lastErrorObject?.updatedExisting) {
            console.log(
              `✅ Updated match: ${mappedFixture.homeTeam?.name} vs ${mappedFixture.awayTeam?.name}`
            );
          } else {
            console.log(
              `ℹ️ No changes for match: ${mappedFixture.homeTeam?.name} vs ${mappedFixture.awayTeam?.name}`
            );
          }
          // if (result.lastErrorObject.updatedExisting) {
          //   console.log(
          //     `✅ Updated match: ${mappedFixture.homeTeam?.name} vs ${mappedFixture.awayTeam?.name}`
          //   );
          // } else {
          //   console.log(
          //     `🆕 Inserted match: ${mappedFixture.homeTeam?.name} vs ${mappedFixture.awayTeam?.name}`
          //   );
          // }
        }
      } else {
        hasNextPage = false;
      }

      pageIndex++;
    }
  } catch (error) {
    console.error("❌ Error fetching last matches:", error.message);
  }
}



// async function get3rdDataLast() {
//   const options = {
//     method: "GET",
//     url: "https://sofascore.p.rapidapi.com/teams/get-last-matches",
//     params: { teamId: "332880", pageIndex: "0" },
//     headers: {
//       "x-rapidapi-key": process.env.RAPIDAPI_SOFASCORE_KEY,
//       "x-rapidapi-host": "sofascore.p.rapidapi.com",
//     },
//   };

//   try {
//     const response = await axios.request(options);
//     const matches = response.data;
//     const hasNextPage = matches.hasNextPage;
//     // await Fixture.deleteMany()
//     if (matches) {
//       // console.log(matches.events);
//       for (const match of matches.events) {
//         const existingFixture = await Fixture.findOne({
//           sp_match_id: match.id,
//           // homeTeam: { $regex: new RegExp(`^${match.homeTeam.name}$`, "i") },
//           // awayTeam: { $regex: new RegExp(`^${match.awayTeam.name}$`, "i") },
//         });

//         if (!existingFixture) {
//           const newFixture = new Fixture({
//             sp_match_id: match.id,
//             videoStreamLink: null,
//             kickoffDateTime: match.startTimestamp,
//             competition: match.tournament?.uniqueTournament?.name,
//             homeTeam: match.homeTeam.name,
//             awayTeam: match.awayTeam.name,
//             status: match.status.description,
//             home_final_scores: match.homeScore?.current || "",
//             away_final_scores: match.awayScore?.current || "",
//             stadium: match.venue?.stadium || "",
//             referee: match.referee || "",
//             tickets: false,
//             presented_by: "RAPTOR",
//           });

//           await newFixture.save();
//           console.log(
//             `Saved match: ${match.homeTeam.name} vs ${match.awayTeam.name}`
//           );
//         } else {
//           existingFixture.status = match.status.description;
//           existingFixture.kickoffDateTime = match.startTimestamp;
//           existingFixture.stadium = match.venue?.stadium || "";
//           existingFixture.referee = match.referee || "";
//           await existingFixture.save();
//           console.log(
//             `Updated match: ${match.homeTeam.name} vs ${match.awayTeam.name}`
//           );
//         }
//       }
//     }
//   } catch (error) {
//     console.error("Error fetching data:", error.message);
//   }
// }

async function get3rdData() {
  const options = {
    method: "GET",
    url: "https://sofascore.p.rapidapi.com/teams/get-next-matches",
    params: { teamId: "332880", pageIndex: "0" },
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_SOFASCORE_KEY,
      "x-rapidapi-host": "sofascore.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    const matches = response.data;

    if (matches?.events?.length) {
      for (const match of matches.events) {
        const mappedFixture = {
          sp_match_id: match.id?.toString(),
          kickoffDateTime: match.startTimestamp,
          customId: match.customId || null,

          tournament: {
            id: match.tournament?.id,
            name: match.tournament?.name,
            slug: match.tournament?.slug,
            category: {
              id: match.tournament?.category?.id,
              name: match.tournament?.category?.name,
              slug: match.tournament?.category?.slug,
              alpha2: match.tournament?.category?.alpha2,
            },
            uniqueTournament: {
              id: match.tournament?.uniqueTournament?.id,
              name: match.tournament?.uniqueTournament?.name,
              slug: match.tournament?.uniqueTournament?.slug,
              primaryColorHex: match.tournament?.uniqueTournament?.primaryColorHex,
              secondaryColorHex: match.tournament?.uniqueTournament?.secondaryColorHex,
            },
          },

          season: {
            id: match.season?.id,
            name: match.season?.name,
            year: match.season?.year,
          },
          roundInfo: {
            round: match.roundInfo?.round,
            name: match.roundInfo?.name,
          },

          homeTeam: {
            id: match.homeTeam?.id,
            name: match.homeTeam?.name,
            slug: match.homeTeam?.slug,
            shortName: match.homeTeam?.shortName,
            gender: match.homeTeam?.gender,
            nameCode: match.homeTeam?.nameCode,
            country: {
              name: match.homeTeam?.country?.name,
              alpha2: match.homeTeam?.country?.alpha2,
              alpha3: match.homeTeam?.country?.alpha3,
              slug: match.homeTeam?.country?.slug,
            },
            teamColors: {
              primary: match.homeTeam?.teamColors?.primary,
              secondary: match.homeTeam?.teamColors?.secondary,
              text: match.homeTeam?.teamColors?.text,
            },
          },
          awayTeam: {
            id: match.awayTeam?.id,
            name: match.awayTeam?.name,
            slug: match.awayTeam?.slug,
            shortName: match.awayTeam?.shortName,
            gender: match.awayTeam?.gender,
            nameCode: match.awayTeam?.nameCode,
            country: {
              name: match.awayTeam?.country?.name,
              alpha2: match.awayTeam?.country?.alpha2,
              alpha3: match.awayTeam?.country?.alpha3,
              slug: match.awayTeam?.country?.slug,
            },
            teamColors: {
              primary: match.awayTeam?.teamColors?.primary,
              secondary: match.awayTeam?.teamColors?.secondary,
              text: match.awayTeam?.teamColors?.text,
            },
          },

          status: {
            code: match.status?.code,
            description: match.status?.description,
            type: match.status?.type,
          },
          homeScore: {
            current: match.homeScore?.current,
            display: match.homeScore?.display,
          },
          awayScore: {
            current: match.awayScore?.current,
            display: match.awayScore?.display,
          },

          stadium: match.venue?.stadium || null,
          referee: match.referee || null,
          tickets: match.tickets || null,
          videoStreamLink: null,
          presented_by: "RAPTOR",
        };

        // Find existing fixture by sp_match_id OR fallback by team names + kickoffDateTime
        const filter = {
          $or: [
            { sp_match_id: mappedFixture.sp_match_id },
            {
              "homeTeam.name": new RegExp(`^${mappedFixture.homeTeam?.name}$`, "i"),
              "awayTeam.name": new RegExp(`^${mappedFixture.awayTeam?.name}$`, "i"),
              kickoffDateTime: mappedFixture.kickoffDateTime,
            },
          ],
        };

        const result = await Fixture.findOneAndUpdate(
          filter,
          { $set: mappedFixture },
          { new: true, upsert: true, rawResult: true }
        );

        if (result.lastErrorObject?.upserted) {
          console.log(
            `🆕 Inserted match: ${mappedFixture.homeTeam?.name} vs ${mappedFixture.awayTeam?.name}`
          );
        } else if (result.lastErrorObject?.updatedExisting) {
          console.log(
            `✅ Updated match: ${mappedFixture.homeTeam?.name} vs ${mappedFixture.awayTeam?.name}`
          );
        } else {
          console.log(
            `ℹ️ No changes for match: ${mappedFixture.homeTeam?.name} vs ${mappedFixture.awayTeam?.name}`
          );
        }
      }
    } else {
      console.warn("⚠️ No events found in API response.");
    }
  } catch (error) {
    console.error("❌ Error fetching data:", error.message);
  }
}
async function get3rdDataNext() {
  let pageIndex = 0;
  let hasNextPage = true;

  try {
    while (hasNextPage) {
      const options = {
        method: "GET",
        url: "https://sofascore.p.rapidapi.com/teams/get-next-matches",
        params: {
          teamId: "332880", // Shabana FC
          pageIndex: pageIndex.toString(),
        },
        headers: {
          "x-rapidapi-key": process.env.RAPIDAPI_SOFASCORE_KEY,
          "x-rapidapi-host": "sofascore.p.rapidapi.com",
        },
      };

      const response = await axios.request(options);
      const matches = response.data;
      hasNextPage = matches?.hasNextPage;

      if (matches?.events?.length) {
        for (const match of matches.events) {
          const mappedFixture = {
            sp_match_id: match.id?.toString(),
            kickoffDateTime: match.startTimestamp,
            customId: match.customId || null,
            tournament: {
              id: match.tournament?.id,
              name: match.tournament?.name,
              slug: match.tournament?.slug,
              category: {
                id: match.tournament?.category?.id,
                name: match.tournament?.category?.name,
                slug: match.tournament?.category?.slug,
                alpha2: match.tournament?.category?.alpha2,
              },
              uniqueTournament: {
                id: match.tournament?.uniqueTournament?.id,
                name: match.tournament?.uniqueTournament?.name,
                slug: match.tournament?.uniqueTournament?.slug,
                primaryColorHex: match.tournament?.uniqueTournament?.primaryColorHex,
                secondaryColorHex: match.tournament?.uniqueTournament?.secondaryColorHex,
              },
            },

            season: {
              id: match.season?.id,
              name: match.season?.name,
              year: match.season?.year,
            },
            roundInfo: {
              round: match.roundInfo?.round,
              name: match.roundInfo?.name,
            },

            homeTeam: {
              id: match.homeTeam?.id,
              name: match.homeTeam?.name,
              slug: match.homeTeam?.slug,
              shortName: match.homeTeam?.shortName,
              gender: match.homeTeam?.gender,
              nameCode: match.homeTeam?.nameCode,
              country: {
                name: match.homeTeam?.country?.name,
                alpha2: match.homeTeam?.country?.alpha2,
                alpha3: match.homeTeam?.country?.alpha3,
                slug: match.homeTeam?.country?.slug,
              },
              teamColors: {
                primary: match.homeTeam?.teamColors?.primary,
                secondary: match.homeTeam?.teamColors?.secondary,
                text: match.homeTeam?.teamColors?.text,
              },
            },
            awayTeam: {
              id: match.awayTeam?.id,
              name: match.awayTeam?.name,
              slug: match.awayTeam?.slug,
              shortName: match.awayTeam?.shortName,
              gender: match.awayTeam?.gender,
              nameCode: match.awayTeam?.nameCode,
              country: {
                name: match.awayTeam?.country?.name,
                alpha2: match.awayTeam?.country?.alpha2,
                alpha3: match.awayTeam?.country?.alpha3,
                slug: match.awayTeam?.country?.slug,
              },
              teamColors: {
                primary: match.awayTeam?.teamColors?.primary,
                secondary: match.awayTeam?.teamColors?.secondary,
                text: match.awayTeam?.teamColors?.text,
              },
            },

            status: {
              code: match.status?.code,
              description: match.status?.description,
              type: match.status?.type,
            },
            homeScore: {
              current: match.homeScore?.current,
              display: match.homeScore?.display,
            },
            awayScore: {
              current: match.awayScore?.current,
              display: match.awayScore?.display,
            },

            stadium: match.venue?.stadium || null,
            referee: match.referee || null,
            tickets: match.tickets || null,
            videoStreamLink: null,
            presented_by: "RAPTOR",
          };

          // UPSERT with insert/update detection
          const result = await Fixture.findOneAndUpdate(
            {
              sp_match_id: mappedFixture.sp_match_id,
              "homeTeam.name": mappedFixture.homeTeam?.name,
              "awayTeam.name": mappedFixture.awayTeam?.name,
            },
            { $set: mappedFixture },
            { new: true, upsert: true, rawResult: true }
          );
          if (result.lastErrorObject?.upserted) {
            console.log(
              `🆕 Inserted match: ${mappedFixture.homeTeam?.name} vs ${mappedFixture.awayTeam?.name}`
            );
          } else if (result.lastErrorObject?.updatedExisting) {
            console.log(
              `✅ Updated match: ${mappedFixture.homeTeam?.name} vs ${mappedFixture.awayTeam?.name}`
            );
          } else {
            console.log(
              `ℹ️ No changes for match: ${mappedFixture.homeTeam?.name} vs ${mappedFixture.awayTeam?.name}`
            );
          }
          // if (result.lastErrorObject.updatedExisting) {
          //   console.log(
          //     `✅ Updated match: ${mappedFixture.homeTeam?.name} vs ${mappedFixture.awayTeam?.name}`
          //   );
          // } else {
          //   console.log(
          //     `🆕 Inserted match: ${mappedFixture.homeTeam?.name} vs ${mappedFixture.awayTeam?.name}`
          //   );
          // }
        }
      } else {
        hasNextPage = false;
      }

      pageIndex++;
    }
  } catch (error) {
    console.error("❌ Error fetching last matches:", error.message);
  }
}

// async function get3rdData() {
//   const options = {
//     method: "GET",
//     url: "https://sofascore.p.rapidapi.com/teams/get-next-matches",
//     params: { teamId: "332880", pageIndex: "0" },
//     headers: {
//       "x-rapidapi-key": process.env.RAPIDAPI_SOFASCORE_KEY,
//       "x-rapidapi-host": "sofascore.p.rapidapi.com",
//     },
//   };

//   try {
//     const response = await axios.request(options);
//     const matches = response.data;
//     // await Fixture.deleteMany()
//     if (matches) {
//       // console.log(matches.events);
//       for (const match of matches.events) {
//         console.log(match)
//         const existingFixture = await Fixture.findOne({
//           sp_match_id: match.id,
//           homeTeam: { $regex: new RegExp(`^${match.homeTeam.name}$`, "i") },
//           awayTeam: { $regex: new RegExp(`^${match.awayTeam.name}$`, "i") },
//         });

//         if (!existingFixture) {
//           const newFixture = new Fixture({
//             sp_match_id: match.id,
//             videoStreamLink: null,
//             kickoffDateTime: match.startTimestamp,
//             competition: match.tournament?.uniqueTournament?.name,
//             homeTeam: match.homeTeam.name,
//             awayTeam: match.awayTeam.name,
//             status: match.status.description,
//             home_final_scores: match.homeScore?.current || "",
//             away_final_scores: match.awayScore?.current || "",
//             stadium: match.venue?.stadium || "",
//             referee: match.referee || "",
//             tickets: false,
//             presented_by: "RAPTOR",
//           });

//           await newFixture.save();
//           console.log(
//             `Saved match: ${match.homeTeam.name} vs ${match.awayTeam.name}`
//           );
//         } else {
//           existingFixture.status = match.status.description;
//           existingFixture.kickoffDateTime = match.startTimestamp;
//           existingFixture.stadium = match.venue?.stadium || "";
//           existingFixture.referee = match.referee || "";
//           await existingFixture.save();
//           console.log(
//             `Updated match: ${match.homeTeam.name} vs ${match.awayTeam.name}`
//           );
//         }
//       }
//     }
//   } catch (error) {
//     console.error("Error fetching data:", error.message);
//   }
//   // get3rdDataLast();
// }
async function cleanData() {
  try {
    const allFixtures = await Fixture.find({});
    await Fixture.deleteMany({
      $or: [
        { competition: { $exists: false } },
        { competition: "" },
        { competition: null }
      ]
    });
    console.log("✅ Deleted all fixtures without a competition name.");


    const grouped = {};

    for (const fixture of allFixtures) {
      const key = `${fixture.competition || ""}_${fixture.kickoffDateTime}_${fixture.homeTeam}_${fixture.awayTeam}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(fixture);
    }

    for (const key in grouped) {
      const fixtures = grouped[key];

      if (fixtures.length > 1) {
        // Pick the most complete one
        let bestFixture = null;
        let bestScore = -1;

        for (const f of fixtures) {
          let score = 0;
          if (f.competition) score++;
          if (f.status) score++;
          if (typeof f.home_final_scores === "number") score++;
          if (typeof f.away_final_scores === "number") score++;
          if (f.stadium) score++;
          if (f.referee) score++;
          if (f.videoStreamLink) score++;

          if (score > bestScore) {
            bestScore = score;
            bestFixture = f;
          }
        }

        // Delete the rest
        for (const f of fixtures) {
          if (f._id.toString() !== bestFixture._id.toString()) {
            await Fixture.deleteOne({ _id: f._id });
            console.log(`🗑️ Deleted duplicate fixture: ${f.homeTeam} vs ${f.awayTeam} on ${f.kickoffDateTime}`);
          }
        }
      }
    }

    console.log("✅ Done cleaning duplicates by competition + kickoffDateTime + teams.");
  } catch (error) {
    console.error("❌ Error during cleanData:", error.message);
  }
}



// Run the function
export { get3rdData, cleanData, get3rdDataLast ,get3rdDataNext};

// import axios from "axios";
// import dotenv from "dotenv";
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";

// dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// async function get3rdData() {
//   const options = {
//     method: "GET",
//     url: "https://sofascore.p.rapidapi.com/teams/get-next-matches",
//     params: { teamId: "332880", pageIndex: "0" },
//     headers: {
//       "x-rapidapi-key": process.env.RAPIDAPI_SOFASCORE_KEY,
//       "x-rapidapi-host": "sofascore.p.rapidapi.com",
//     },
//   };

//   try {
//     const response = await axios.request(options);
//     const matches = response.data?.events || [];

//     const fixtures = matches.map((match) => ({
//       sp_match_id: match.id,
//       videoStreamLink: null,
//       kickoffDateTime: match.startTimestamp,
//       competition: match.tournament?.uniqueTournament?.name,
//       homeTeam: match.homeTeam.name,
//       awayTeam: match.awayTeam.name,
//       status: match.status.description,
//       home_final_scores: match.homeScore?.current || "",
//       away_final_scores: match.awayScore?.current || "",
//       stadium: match.venue?.stadium || "",
//       referee: match.referee || "",
//       tickets: false,
//       presented_by: "RAPTOR",
//     }));

//     // Write to exact location relative to the file
//     const filePath = path.resolve(__dirname, "../json-db/fixtures.json");
//     fs.writeFileSync(filePath, JSON.stringify(fixtures, null, 2));
//     console.log(`✅ Saved ${fixtures.length} fixtures to ${filePath}`);
//   } catch (error) {
//     console.error("❌ Error fetching data:", error.message);
//   }
// }

// export default get3rdData;
