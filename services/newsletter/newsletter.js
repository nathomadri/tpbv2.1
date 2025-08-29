import Userv1 from "../../models/Userv1.js";

export const addUser = async (req, res) => {
  try {
    const { userName, email, ip } = req.body;

    
    let user = await Userv1.findOne({ email: email, userName: userName });

    if (user) {
      
      if (!user.ip.includes(ip)) {
        user.ip.push(ip); 
        await user.save();
      }
      return res.status(200).json({ message: "User already exists, IP updated if necessary." });
    } else {
      
      user = new Userv1({
        userName,
        email,
        ip: [ip],
      });
      await user.save();
      return res.status(201).json({ message: "User created successfully." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
