const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const reviewRouter = require("./route/v1/reviewRoute.js");
const blogRouter = require("./route/v1/blogRoute.js");
const authRouter = require("./route/v1/authRoute.js");
const authorRoute = require("./route/v1/authorRoute.js");
const userRoute = require("./route/v1/userRoute.js");
const statsRoute = require("./route/v1/statsRoute.js");
const redirectRoute = require("./route/v1/redirectRoute.js");
const flatsRouter = require("./route/v1/flatsRoute.js");
const servicesRouter = require("./route/v1/servicesRoute.js");
const bookingRouter = require("./route/v1/bookingRoute.js");
const bannerRouter = require("./route/v1/bannerRoute.js");
const offerRouter = require("./route/v1/offerRoute.js");
const inquiryRouter = require("./route/v1/inquiryRoute.js");


const PORT = process.env.PORT || 4000;
const MONGODB_URL = process.env.MONGODB_URL;

const frontend =
  process.env.NODE_ENV === "production"
    ? process.env.FRONT_END_HOSTED
    : process.env.FRONT_END_LOCAL;

const app = express();

app.use(
  cors({
    origin: frontend,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", 1)
app.use("/images", express.static("images"));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/blog", blogRouter);
app.use("/api/v1/author", authorRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/stats", statsRoute);
app.use("/api/v1/flats", flatsRouter);
app.use("/api/v1/services", servicesRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/banner", bannerRouter);
app.use("/api/v1/offer", offerRouter);
app.use("/api/v1/inquiry", inquiryRouter);
app.use("/s", redirectRoute);


app.get("/", (req, res) => {
  res.json({ message: "Hie ;), serving to Himalayan AMA" });
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
