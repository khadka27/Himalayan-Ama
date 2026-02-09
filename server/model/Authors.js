const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
    authorName: { type: String, required: true },
    authorImage: { type: String, required: true },
    authorCertificate: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Author", authorSchema);
