const mongoose = require("mongoose");

const BannerSchema = new mongoose.Schema({
    title: String,
    subtitle: String,
    imageUrl: String,
    cloudinaryPublicId: String,
    link: String,
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Banner", BannerSchema);
