import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import dotenv from "dotenv";
import cors from "cors";

// locals imports
import usersRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";
import blogsRouter from "./routes/blogs.js";
import homeRouter from "./routes/home.js";
import requestRouter from "./routes/v1.js";
import adsRouter from "./routes/ads.js";
import bettingRouter from "./routes/betting.js"
import livestreamRouter from "./routes/livestreams.js";
import fixturesRouter from "./routes/fixtures.js";

import betgreenRouter from "./routes/betgreen.js";
import statsRouter from "./routes/stats.js"
import scheduleAnalysis from "./services/automation/automation.js";
// initialise the app
const app = express();

dotenv.config();

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(helmet());
app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// route
app.use("/api", homeRouter);
app.use("/api/v1", requestRouter);
app.use("/api/pass", adsRouter);
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/blogs", blogsRouter);
app.use("/api/livestreams", livestreamRouter);
app.use("/api/fixtures", fixturesRouter);
app.use("/api/betting", bettingRouter);
app.use("/api/betgreen", betgreenRouter);
app.use("/api/stats", statsRouter)
// app.use("/api/predictions", predictionRouter);



// mongodb connection
mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGO_URL);
console.log("Connection to database --success");


scheduleAnalysis()
// startMaintainer()
// server listening PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started at port --localhost:${PORT}`);
});

