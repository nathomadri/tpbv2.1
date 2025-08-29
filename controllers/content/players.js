const players = [
  // Goalkeepers
  {
    position: "Goalkeeper",
    img: "/images/squad/mulili-maxwell.png",
    name: "Maxwell Muchesia",
    dob: "",
    kitNumber: "77",
    joined: "2024",
    previousClub: "AFC Leopards SC",
    status: "New Signing",
  },
  {
    position: "Goalkeeper",
    img: "/images/squad/fredrick-otinda.png",
    name: "Fredrick Otinda",
    dob: "",
    kitNumber: "29",
    joined: "",
    previousClub: "",
    status: "",
  },

  // Defenders
  {
    position: "Defender",
    img: "#",
    name: "Nicholas Meja",
    dob: "1999-03-08",
    kitNumber: 2,
    joined: "2024",
    previousClub: "Bandari FC",
    status: "New Signing",
  },
  {
    position: "Defender",
    img: "/images/squad/elvis-ochieng.jpg",
    name: "Elvis Ochieng",
    dob: "1997-07-15",
    kitNumber: "22",
    joined: "2024",
    previousClub: "Posta Rangers FC",
    status: "New Signing",
  },
  {
    position: "Defender",
    img: "#",
    name: "Mark Okola",
    dob: "",
    kitNumber: "15",
    joined: "2024",
    previousClub: "",
    status: "",
  },
  {
    position: "Defender",
    img: "/images/squad/dizzo-onya.jpg",
    name: "George Onyango Dizzo",
    dob: "",
    kitNumber: "6",
    joined: "",
    previousClub: "",
    status: "",
  },
  {
    position: "Defender",
    img: "/images/squad/dimpol.jpg",
    name: "Dimpol Onyango",
    dob: "",
    kitNumber: "3",
    joined: "",
    previousClub: "",
    status: "",
  },

  // Midfielders
  {
    position: "Midfielder",
    img: "#",
    name: "Cliff Nyakeya",
    dob: "1995-01-11",
    kitNumber: 10,
    joined: "2024",
    previousClub: "",
    status: "",
  },
  {
    position: "Midfielder",
    img: "/images/squad/kevin-nyabuto-omundi.jpg",
    name: "Kevin Omundi",
    dob: "",
    kitNumber: "8",
    joined: "",
    previousClub: "",
    status: "",
  },
  {
    position: "Midfielder",
    img: "#",
    name: "Douglas Mokaya",
    dob: "",
    kitNumber: "",
    joined: "2025",
    previousClub: "BIDCO UNITED",
    status: "New Sigining",
  },
  {
    position: "Midfielder",
    img: "/images/squad/OLOO.jpg",
    name: "Derrick Oketch Oloo",
    dob: "",
    kitNumber: "",
    joined: "2025",
    previousClub: "EBWALI SECONDARY SCHOOL",
    status: "New Sigining",
  },

  {
    position: "Midfielder",
    img: "/images/squad/justine-omwando.jpg",
    name: "Justine Omwando",
    dob: "",
    kitNumber: "16",
    joined: "",
    previousClub: "",
    status: "",
  },
  {
    position: "Midfielder",
    img: "/images/squad/brian-mich.jpg",
    name: "Brian Michira",
    dob: "1996-09-11",
    kitNumber: 14,
    joined: "2022",
    previousClub: "Shabana FC",
    status: "Existing",
  },

  // Forwards
  {
    position: "Forward",
    img: "/images/squad/samuel-maiko-kadozjpg.jpg",
    name: "Samuel Maiko",
    dob: "1998-12-25",
    kitNumber: "24",
    joined: "",
    previousClub: "",
    status: "",
  },
  {
    position: "Forward",
    img: "/images/squad/msagha-darius.jpg",
    name: "Darius Msagha",
    dob: "",
    kitNumber: "33",
    joined: "",
    previousClub: "",
    status: "",
  },
  {
    position: "Forward",
    img: "#",
    name: "Dennis Okoth",
    dob: "",
    kitNumber: "11",
    joined: "",
    previousClub: "",
    status: "",
  },
];

import Player from "../../models/content/Player.js";
import Joi from "joi";
import CryptoJS from "crypto-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePathPlayers = path.resolve(
  __dirname,
  "../../json-db/shabana-players.json"
);

const data = fs.readFileSync(filePathPlayers, "utf-8");
const shabana_players = JSON.parse(data);

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

const playerSchema = Joi.object({
  name: Joi.string().required(),
  position: Joi.string().required(),
  kitNumber: Joi.number().required(),
  dateOfBirth: Joi.date().required(),
  joinDate: Joi.date().required(),
  previousClub: Joi.string().required(),
  status: Joi.string().required(),
  image: Joi.string().required(),
});

// Add Player
export const addPlayer = async (req, res) => {
  const { error } = playerSchema.validate(req.body);

  if (error) {
    return res
      .status(400)
      .json({ message: "Validation error", details: error.details });
  }

  try {
    const {
      name,
      position,
      kitNumber,
      dateOfBirth,
      joinDate,
      previousClub,
      status,
      image,
    } = req.body;

    const existingPlayer = await Player.findOne({ name });
    if (existingPlayer) {
      return res
        .status(400)
        .json({ message: "Player with this name already exists" });
    }

    const newPlayer = new Player({
      name,
      position,
      kitNumber,
      dateOfBirth,
      joinDate,
      previousClub,
      status,
      image,
    });
    await newPlayer.save();

    res.status(200).json({ message: "Player added successfully", newPlayer });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating player", error: error.message });
  }
};

// Bulk Insert Players
export const addPlayersBatch = async () => {
  try {
    console.log("Starting player batch insert...");

    // await Player.deleteMany();

    for (const player of players) {
      const existingPlayer = await Player.findOne({ name: player.name });
      if (!existingPlayer) {
        const newPlayer = new Player({
          name: player.name,
          position: player.position,
          kitNumber: player.kitNumber,
          dateOfBirth: player.dob || null,
          joinDate: player.joined || null,
          previousClub: player.previousClub || "",
          status: player.status || "Active",
          image: player.img || "",
        });
        await newPlayer.save();
      }
    }

    console.log("Players added successfully");
  } catch (error) {
    console.error("Error adding players:", error.message);
  }
};

// Get Players
export const getPlayers = async (req, res) => {
  try {
    const players = await Player.find();

    const encryptedData = encryptData(players);

    if (!encryptedData) {
      return res.status(500).json({ message: "Encryption failed" });
    }
    
    res.status(200).json({ message: "success", encryptedData });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching players", error: error.message });
  }
};

// Get PLAYER
export const getPlayer = async (req, res) => {
  try {
    const { name } = req.query; // slugified name e.g. "maxwell-muchesia"

    // Define a function to clean and slugify DB names
    const slugify = (text) =>
      text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-");

    // Fetch all players (or optimize this to fetch once with indexed field if DB grows)
    const allPlayers = await Player.find({});

    const matchedPlayer = allPlayers.find((p) => slugify(p.name) === name);

    if (!matchedPlayer) {
      return res.status(404).json({ message: "Player not found" });
    }

    const encryptedData = encryptData([matchedPlayer]);

    if (!encryptedData) {
      return res.status(500).json({ message: "Encryption failed" });
    }

    res.status(200).json({ message: "success", encryptedData });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching player", error: error.message });
  }
};

// Edit Player by Name
export const editPlayer = async (req, res) => {
  const {
    name,
    position,
    kitNumber,
    dateOfBirth,
    joinDate,
    previousClub,
    status,
    image,
  } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Player name is required" });
  }

  try {
    const updatedPlayer = await Player.findOneAndUpdate(
      { name },
      {
        position,
        kitNumber,
        dateOfBirth,
        joinDate,
        previousClub,
        status,
        image,
      },
      { new: true }
    );

    if (!updatedPlayer) {
      return res.status(404).json({ message: "Player not found" });
    }

    res
      .status(200)
      .json({ message: "Player updated successfully", updatedPlayer });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating player", error: error.message });
  }
};

// Delete Player by Name
export const deletePlayer = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Player name is required" });
  }

  try {
    const deletedPlayer = await Player.findOneAndDelete({ name });

    if (!deletedPlayer) {
      return res.status(404).json({ message: "Player not found" });
    }

    res
      .status(200)
      .json({ message: "Player deleted successfully", deletedPlayer });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting player", error: error.message });
  }
};
