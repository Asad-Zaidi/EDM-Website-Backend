const express = require("express");
const router = express.Router();
const { addReview, getReviewsByProduct, getReviewStats } = require("../controllers/reviewController");

// POST: Add new review
router.post("/", addReview);

// GET: Fetch review statistics
router.get("/admin/stats", getReviewStats);

// GET: Fetch reviews for a product
router.get("/:productId", getReviewsByProduct);

module.exports = router;
