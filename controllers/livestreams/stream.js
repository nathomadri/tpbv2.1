import LiveStream from "../../models/livestreams/LiveStreams.js";
import Joi from 'joi';

// Define the validation schema for a livestream
const livestreamSchema = Joi.object({
  videoStreamLink: Joi.string().uri().required(),
  kickoffDateTime: Joi.string(),
  competition: Joi.string().required(),
  status: Joi.string().required(),
  homeTeam: Joi.string().required(),
  awayTeam: Joi.string().required(),
});

export const createLiveStream = async (req, res) => {
  // Validate the request body
  const { error } = livestreamSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ message: "Validation error", details: error.details });
  }

  try {
    const newLiveStream = new LiveStream(req.body);
    await newLiveStream.save();
    res.status(201).json(newLiveStream);
  } catch (error) {
    res.status(400).json({ message: "Error creating livestream", error: error.message });
  }
};


// Function to get all livestreams
export const getAllLiveStreams = async (req, res) => {
  try {
    const liveStreams = await LiveStream.find();
    res.status(200).json(liveStreams);
  } catch (error) {
    res.status(500).json({ message: "Error fetching livestreams", error: error.message });
  }
};

// Function to get a single livestream by ID
export const getLiveStreamById = async (req, res) => {
  try {
    const liveStream = await LiveStream.findById(req.params.id);
    if (!liveStream) {
      return res.status(404).json({ message: "Livestream not found" });
    }
    res.status(200).json(liveStream);
  } catch (error) {
    res.status(500).json({ message: "Error fetching livestream", error: error.message });
  }
};


// Update an existing livestream
export const updateLiveStream = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const livestream = await LiveStream.findByIdAndUpdate(id, updatedData, { new: true });
    if (!livestream) {
      return res.status(404).json({ message: "Livestream not found" });
    }
    res.status(200).json(livestream);
  } catch (error) {
    console.error("Error updating livestream:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a livestream
export const deleteLiveStream = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedLivestream = await LiveStream.findByIdAndDelete(id);
    if (!deletedLivestream) {
      return res.status(404).json({ message: "Livestream not found" });
    }
    res.status(200).json({ message: "Livestream deleted successfully" });
  } catch (error) {
    console.error("Error deleting livestream:", error);
    res.status(500).json({ message: "Server error" });
  }
};