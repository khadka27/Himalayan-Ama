const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  flat: { type: mongoose.Schema.Types.ObjectId, ref: "Flat", required: true },
  rating: { type: Number, required: true },
  review: { type: String, required: true },
  isPulished: { type: Boolean, required: true, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);
