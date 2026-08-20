const mongoose = require("mongoose");

const hostSchema = new mongoose.Schema({
    hostName: {
        type: String,
        required: true
    },
    imageUri: {
        type: String,
        required: true
    },
    profession: {
        type: String,
        default: "MANAGER / HOST"
    },
    quote: {
        type: String
    },
    bio: {
        type: String
    },
    bioParagraphs: {
        type: [String],
        default: []
    },
    languages: {
        type: mongoose.Schema.Types.Mixed,
        default: ["English", "Nepali"]
    },
    hospitalityBadge: {
        type: String,
        default: "Gurung Family Hospitality"
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Host", hostSchema);
