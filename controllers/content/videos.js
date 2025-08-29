import Video from "../../models/content/Videos.js";
import Joi from "joi";
import CryptoJS from "crypto-js";

// Encryption Function
const encryptData = (data) => {
  try {
    return CryptoJS.AES.encrypt(
      JSON.stringify(data),
      process.env.SECRET_KEY
    ).toString();
  } catch (error) {
    console.error("Encryption Error:", error.message);
    return null;
  }
};

const videoSchema = Joi.object({
  link: Joi.string().required(),
  name: Joi.string().required(),
});

// Add Video
export const addVideo = async (req, res) => {
  const { error } = videoSchema.validate(req.body);

  if (error) {
    return res
      .status(400)
      .json({ message: "Validation error", details: error.details });
  }

  try {
    const { name, link } = req.body;

    const existingVideo = await Video.findOne({ name });
    if (existingVideo) {
      return res
        .status(400)
        .json({ message: "Video with this name already exists" });
    }

    const newVideo = new Video({ name, link });
    await newVideo.save();

    res.status(200).json({ message: "Video added successfully", newVideo });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating video", error: error.message });
  }
};

// Get Videos
export const getVideos = async (req, res) => {
  try {
    const videos = await Video.find();

    const encryptedData = encryptData(videos);

    if (!encryptedData) {
      return res.status(500).json({ message: "Encryption failed" });
    }

    res.status(200).json({ message: "success", encryptedData });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching videos", error: error.message });
  }
};

// Edit Video by Name
export const editVideo = async (req, res) => {
  const { name, link, } = req.body;

  if (!name || !link) {
    return res.status(400).json({ message: "Both name and link are required" });
  }

  try {
    const updatedVideo = await Video.findOneAndUpdate(
      { name },
      { link },
      { new: true }
    );

    if (!updatedVideo) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.status(200).json({ message: "Video updated successfully", updatedVideo });
  } catch (error) {
    res.status(500).json({ message: "Error updating video", error: error.message });
  }
};

// Delete Video by Name
export const deleteVideo = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Video name is required" });
  }

  try {
    const deletedVideo = await Video.findOneAndDelete({ name });

    if (!deletedVideo) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.status(200).json({ message: "Video deleted successfully", deletedVideo });
  } catch (error) {
    res.status(500).json({ message: "Error deleting video", error: error.message });
  }
};
