// backend/models/Message.js
const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    name: { type: String, default: "Anonymous" },
    email: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    handled: { type: Boolean, default: false },
});

module.exports = mongoose.model("Message", MessageSchema);
