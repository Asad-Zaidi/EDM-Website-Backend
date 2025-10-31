const Review = require("../models/Review");
const Product = require("../models/Product");

exports.addReview = async (req, res) => {
    try {
        const { productId, name, comment, rating } = req.body;

        if (!productId || !name || !comment || !rating) {
            return res.status(400).json({ message: "All fields are required" });
        }

        
        const newReview = new Review({ productId, name, comment, rating });
        await newReview.save();

        
        const reviews = await Review.find({ productId });
        const avgRating =
            reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

        
        await Product.findByIdAndUpdate(productId, {
            avgRating,
            totalReviews: reviews.length,
        });

        res.status(201).json(newReview); 
    } catch (err) {
        console.error("Error adding review:", err);
        res.status(500).json({ message: "Error adding review" });
    }
};

exports.getReviewsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await Review.find({ productId }).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: "Error fetching reviews" });
    }
};


exports.getReviewStats = async (req, res) => {
    try {
        
        const productStats = await Product.find({}, "name avgRating totalReviews");

        
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
        console.error("Error fetching review stats:", err);
        res.status(500).json({ message: "Error fetching review stats" });
    }
};

exports.getReviewsByProductSlug = async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug });
        if (!product) return res.status(404).json({ message: "Product not found" });

        const reviews = await Review.find({ productId: product._id }).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: "Error fetching reviews" });
    }
};