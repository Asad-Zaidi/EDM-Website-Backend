const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String },
    facebook: { type: String },
    instagram: { type: String },
    twitter: { type: String },
    mapEmbedUrl: { type: String },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Contact", ContactSchema);
