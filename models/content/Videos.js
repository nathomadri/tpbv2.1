import mongoose, { Schema } from "mongoose";

const ourVideoSchema = new Schema(
  {
    link: { type: String },
    name: { type: String },
  },
  { timestamps: true }
);

var Video = mongoose.model("Video", ourVideoSchema);
export default Video;
