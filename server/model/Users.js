const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  version: { type: Number, default: 0 },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["admin", "employee"], default: "employee" },
  department: { type: String },
  position: { type: String, enum: ["full-time", "intern", "part-time"], default: "full-time" },
  isActive: {
    type: Boolean,
    default: true
  },
  dateJoined: { type: Date, default: Date.now },
  profileUri: {
    type: String,
  },

  leaveBalance: {
    casual: { type: Number, default: 1 },
    sick: { type: Number, default: 1 },
    period: { type: Number, default: 1 },
  },
  timeEntries: {
    clockInEarly: { type: String, default: "10:00:00" },
    clockInLate: { type: String, default: "11:00:00" },
    clockInLateEarly: { type: String, default: "11:01:00" },
    clockInLateLate: { type: String, default: "13:00:00" },
    clockInEarlyHalfDay: { type: String, default: "13:01:00" },
    clockInLatehalfDay: { type: String, default: "16:00:00" },
    BreakInEarly: { type: String, default: "14:00:00" },
    BreakInLate: { type: String, default: "15:30:00" },
    BreakOutEarly: { type: String, default: "15:00:00" },
    BreakOutLate: { type: String, default: "16:05:00" },
    clockOutEarly: { type: String, default: "17:00:00" },
    clockOutLate: { type: String, default: "21:00:00" },
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
