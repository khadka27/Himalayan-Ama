const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const mongoose = require("mongoose");
require("./job/cronJobs.js")
const cookieParser = require("cookie-parser");
const authRouter = require("./route/authRoute.js");
const userRouter = require("./route/userRoute.js");
const attendanceRoute = require("./route/attendanceRoute.js");
const leaveRequestRoute = require("./route/leaveRequestRoute.js");
const performanceRoute = require("./route/performanceRoute.js");
const generalLimiter = require("./middleware/rateLimiter.js")
const { getIp, isAtOffice } = require("./util/ip.js")


const PORT = process.env.PORT || 4000;
const MONGODB_URL = process.env.MONGODB_URL;

const frontend =
  process.env.NODE_ENV === "production"
    ? process.env.FRONT_END_HOSTED
    : process.env.FRONT_END_LOCAL;

const app = express();

app.use(
  cors({
    origin: [frontend, "client.fotokrew.com"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
// app.use(generalLimiter);
app.set("trust proxy", 1)
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/attendance", attendanceRoute);
app.use("/api/leave", leaveRequestRoute);
app.use("/api/performance", performanceRoute);

app.get("/", (req, res) => {
  res.json({ message: "Hie ;)" });
});

app.get("/api/isAtOffice", (req, res) => {
  const isUserAtOffice = isAtOffice(req);
  res.json({ isUserAtOffice: isUserAtOffice });
});

mongoose.connect(MONGODB_URL)
  .then(() => {
    console.log("Connected to database successfully");
    app.listen(PORT, () => {
      console.log(`Listening to port http://localhost:${PORT} and serving to ${frontend}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
