const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    metaTitle: { type: String },
    metaDescription: { type: String },
    slug: { type: String, required: true, unique: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    bannerImageURI: { type: String, required: true },
    category: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "Author", required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    publishDate: { type: Date, required: true },
    isActive: { type: Boolean, required: true, default: true },
    keyTakeaways: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model("Blog", blogSchema);
