const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
    bannerText: {
        type: String,
        required: true,
        default: "Welcome to Himalayan Yogii!"
    },
    backgroundColor: {
        type: String,
        default: "#6B8E6A"
    },
    textColor: {
        type: String,
        default: "#ffffff"
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Banner", bannerSchema);
