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
        type: String
    },
    bio: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Host", hostSchema);
