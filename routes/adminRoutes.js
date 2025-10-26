const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const User = require("../models/User");
const Visit = require("../models/Visit");
const Review = require("../models/Review");

// ✅ Get main admin stats (Dashboard summary)
router.get("/stats", async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalVisits = await Visit.countDocuments();

        const reviews = await Review.find();
        const totalReviews = reviews.length;
        const averageRating =
            totalReviews > 0
                ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
                : 0;

        const recentProducts = await Product.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select("name category priceMonthly imageUrl createdAt");

        const recentActivities = await Product.find()
            .sort({ updatedAt: -1 })
            .limit(5)
            .select("name category updatedAt");

        res.json({
            totalProducts,
            totalUsers,
            totalVisits,
            totalReviews,
            averageRating,
            recentProducts,
            recentActivities,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// ✅ New: Get daily visit analytics (for Line Chart)
router.get("/daily-visits", async (req, res) => {
    try {
        const dailyVisits = await Visit.aggregate([
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json(dailyVisits);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
