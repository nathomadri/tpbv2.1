import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const getAds = async (req, res) => {
  try {
    const ads = [
      {
        name: "AZAMTV",
        url_thumb: "/images/azamtv.png", 
        url: "https://azamtv.co.tz/", 
      },
      {
        name: "SportPesa",
        url_thumb: "/images/sportpesa-logo.webp", 
        url: "https://www.ke.sportpesa.com/?partner=shabananation", 
      },
    ];

    res.status(200).json({ ads: ads, error: false, code: 0 });
  } catch (err) {
    res.status(200).json({ ads: [], error: true, code: 3 });
  }
};
