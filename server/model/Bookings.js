const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  isVerified: { type: Boolean, required: true, default: false },
  status: { type: String, default: "pending", enum: ["pending", "confirmed", "overlap", "rejected"] },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  participants: { type: Number, default: 1 },
  message: { type: String },
  flat: { type: mongoose.Schema.Types.ObjectId, ref: "Flat", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
