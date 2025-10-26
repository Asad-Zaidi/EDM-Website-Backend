const Product = require('../models/Product');
const Visit = require("../models/Visit");

const getAdminStats = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const categories = await Product.distinct("category");

        const categoryCounts = await Promise.all(
            categories.map(async (cat) => ({
                category: cat,
                count: await Product.countDocuments({ category: cat })
            }))
        );

        const recentProducts = await Product.find().sort({ createdAt: -1 }).limit(5);

        res.json({ totalProducts, categoryCounts, recentProducts });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🧭 Get daily visit stats
const getDailyVisits = async (req, res) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // include today

        const visits = await Visit.aggregate([
            {
                $match: {
                    createdAt: { $gte: sevenDaysAgo },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // 🧩 Fill missing dates with 0 counts
        const result = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(sevenDaysAgo);
            d.setDate(d.getDate() + i);
            const dateStr = d.toISOString().split("T")[0];
            const found = visits.find((v) => v._id === dateStr);
            result.push({ _id: dateStr, count: found ? found.count : 0 });
        }

        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


module.exports = { getAdminStats, getDailyVisits };
