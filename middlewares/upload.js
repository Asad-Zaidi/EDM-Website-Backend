// backend/middlewares/upload.js
const multer = require("multer");

// Store the file in memory (buffer) instead of disk
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
});

module.exports = upload;
