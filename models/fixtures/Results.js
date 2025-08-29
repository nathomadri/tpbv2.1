import mongoose, { Schema } from "mongoose";

const resultSchema = new Schema(
  {
    video_highlights: { type: String },
    kickoffDateTime: { type: String },
    competition: { type: String },
    homeTeam: { type: String },
    home_final_scores: { type: String },
    awayTeam: { type: String },
    away_final_scores: { type: String },
    status: { type: String },
    stadium: { type: String },
    referee: { type: String },
    
  },
  { timestamps: true }
);

var Result = mongoose.model("Result", resultSchema);
export default Result;
