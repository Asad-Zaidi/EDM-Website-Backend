// backend/routes/contactRoutes.js
const express = require("express");
const router = express.Router();

const {
    getContact,
    updateContact,
    submitMessage,
    listMessages,
    setMessageHandled,
} = require("../controllers/contactController");

// middlewares (you have these already in your project)
const auth = require("../middlewares/authMiddleware"); // must exist
const adminOnly = require("../middlewares/adminMiddleware"); // must exist

// Public
router.get("/", getContact);
router.post("/message", submitMessage);

// Admin protected
router.put("/", auth, adminOnly, updateContact);
router.get("/messages", auth, adminOnly, listMessages);
router.put("/messages/:id/handled", auth, adminOnly, setMessageHandled);

module.exports = router;
