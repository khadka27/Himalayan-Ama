const mongoose = require("mongoose");

const flatSchema = new mongoose.Schema({
  flatName: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  isActive: {type: Boolean, required: true, default: true},
  imagesUri: {type: [String], required: true}
}, { timestamps: true });

module.exports = mongoose.model("Flat", flatSchema);
