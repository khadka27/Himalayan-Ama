const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  isVerified: {type: Boolean, required: true, default: false},
  startDate: {type: Date, required: true},
  endDate: {type: Date, required: true},
  flat: { type: mongoose.Schema.Types.ObjectId, ref: "Flat", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
