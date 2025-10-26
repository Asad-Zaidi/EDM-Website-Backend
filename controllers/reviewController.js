const Review = require("../models/Review");

// Create new review
const addReview = async (req, res) => {
    try {
        const { productId, username, rating, comment } = req.body;

        if (!productId || !rating) {
            return res.status(400).json({ message: "Product ID and rating are required" });
        }

        const review = await Review.create({ productId, username, rating, comment });
        res.status(201).json(review);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all reviews for a product
const getReviewsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await Review.find({ productId }).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getReviewStats = async (req, res) => {
    try {
        // 1️⃣ Group reviews by product
        const productStats = await Review.aggregate([
            {
                $group: {
                    _id: "$productId",
                    avgRating: { $avg: "$rating" },
                    totalReviews: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "product",
                },
            },
            { $unwind: "$product" },
            {
                $project: {
                    _id: 1,
                    avgRating: { $round: ["$avgRating", 1] },
                    totalReviews: 1,
                    productName: "$product.name",
                },
            },
        ]);

        // 2️⃣ Get overall rating distribution (1–5 stars)
        const distribution = await Review.aggregate([
            {
                $group: {
                    _id: "$rating",
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        res.json({ productStats, distribution });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { addReview, getReviewsByProduct, getReviewStats };
