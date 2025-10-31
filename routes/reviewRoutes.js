const express = require("express");
const router = express.Router();
const { addReview , getReviewStats } = require("../controllers/reviewController");
const Review = require("../models/Review");

// POST: Add new review
router.post("/", addReview);

// GET: Fetch review statistics
router.get("/admin/stats", getReviewStats);

// GET: Fetch reviews for a product
// router.get("/:productId", getReviewsByProduct);
router.get("/product/:productId", async (req, res) => {
    const { productId } = req.params;
    const reviews = await Review.find({ productId }).sort({ createdAt: -1 });
    res.json(reviews);
});


module.exports = router;
