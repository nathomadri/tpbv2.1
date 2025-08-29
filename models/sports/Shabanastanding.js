import mongoose, { Schema } from "mongoose";

const dataSchema = new Schema(
  {
    standings_id: { type: String, required: true },
    standings: { type: Object },
    season_id: { type: String, required: true },
    season_name: { type: String, required: true },
    season_year: { type: String, }

  },

  { timestamps: true }
);

var Shabanastanding = mongoose.model("Shabanastanding", dataSchema);
export default Shabanastanding;
