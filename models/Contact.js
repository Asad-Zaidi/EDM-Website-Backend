// backend/models/Contact.js
const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
    companyName: { type: String, required: true, default: "My Company" },
    whatsapp: { type: String, required: true, default: "" },
    email: { type: String, required: true, default: "" },
    social: {
        facebook: { type: String, default: "" },
        instagram: { type: String, default: "" },
        youtube: { type: String, default: "" },
        tiktok: { type: String, default: "" },
        x: { type: String, default: "" } // X/Twitter
    },
    // flexible extraFields: admin can add more keys (stored as object)
    extraFields: { type: Map, of: String, default: {} },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Contact", ContactSchema);
