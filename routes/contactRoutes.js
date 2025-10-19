const express = require("express");
const router = express.Router();
const { getContact, updateContact } = require("../controllers/contactController");
const auth = require("../middlewares/authMiddleware");
const adminOnly = require("../middlewares/adminMiddleware");

// Public route
router.get("/", getContact);

// Admin-only update
router.put("/", auth, adminOnly, updateContact);

module.exports = router;
