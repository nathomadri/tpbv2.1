import mongoose, { Schema } from "mongoose";

const teamSchema = new Schema(
  {
    id: { type: Number },
    name: { type: String },
    slug: { type: String },
    shortName: { type: String },
    gender: { type: String },
    nameCode: { type: String },
    country: {
      name: { type: String },
      alpha2: { type: String },
      alpha3: { type: String },
      slug: { type: String },
    },
    teamColors: {
      primary: { type: String },
      secondary: { type: String },
      text: { type: String },
    },
  },
  { _id: false }
);

const tournamentSchema = new Schema(
  {
    id: { type: Number },
    name: { type: String },
    slug: { type: String },
    category: {
      id: { type: Number },
      name: { type: String },
      slug: { type: String },
      alpha2: { type: String },
    },
    uniqueTournament: {
      id: { type: Number },
      name: { type: String },
      slug: { type: String },
      primaryColorHex: { type: String },
      secondaryColorHex: { type: String },
    },
  },
  { _id: false }
);

const fixtureSchema = new Schema(
  {
    sp_match_id: { type: String, index: true, unique: true },
    kickoffDateTime: { type: String },
    customId: { type: String },

    // Tournament / Season
    tournament: tournamentSchema,
    season: {
      id: { type: Number },
      name: { type: String },
      year: { type: String },
    },
    roundInfo: {
      round: { type: Number },
      name: { type: String },
    },

    // Teams
    homeTeam: teamSchema,
    awayTeam: teamSchema,

    // Scores & Status
    status: {
      code: { type: Number },
      description: { type: String },
      type: { type: String },
    },
    homeScore: {
      current: { type: Number },
      display: { type: String },
    },
    awayScore: {
      current: { type: Number },
      display: { type: String },
    },

    // Extra
    stadium: { type: String },
    referee: { type: String },
    tickets: { type: String },
    videoStreamLink: { type: String },
    presented_by: { type: String },
  },
  { timestamps: true }
);

const Fixture = mongoose.model("Fixture", fixtureSchema);
export default Fixture;
