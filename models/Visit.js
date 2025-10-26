const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
    ip: { type: String },
    page: { type: String },
},
    { timestamps: true });

module.exports = mongoose.model("Visit", visitSchema);
