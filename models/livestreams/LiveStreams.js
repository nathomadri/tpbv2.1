import mongoose, { Schema } from "mongoose";

const liveStreamSchema = new Schema(
  {
    videoStreamLink: { type: String, required: true },
    kickoffDateTime: { type: String, required: true },
    competition: { type: String, required: true },
    homeTeam: { type: String, required: true },
    awayTeam: { type: String, required: true },
    status: { type: String,},
  },
  { timestamps: true }
);

var LiveStream = mongoose.model("LiveStream", liveStreamSchema);
export default LiveStream;
