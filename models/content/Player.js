import mongoose, { Schema } from "mongoose";

const playerSchema = new Schema(
  {
    name: { type: String, unique: true, required: true, trim: true },
    position: { type: String },
    kitNumber: { type: String },
    dateOfBirth: { type: String },
    joinDate: { type: String },
    previousClub: { type: String },
    status: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

const Player = mongoose.model("Player", playerSchema);
export default Player;
