// const mongoose = require('mongoose');

// const ProductSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     description: { type: String },
//     category: { type: String, required: true },
//     priceMonthly: { type: Number },
//     priceYearly: { type: Number },
//     priceShared: { type: Number },
//     pricePrivate: { type: Number },
//     imageUrl: { type: String },
//     cloudinaryPublicId: { type: String },
//     viewCount: { type: Number, default: 0 },
//     createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Product', ProductSchema);

const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    priceMonthly: { type: Number },
    priceYearly: { type: Number },
    priceShared: { type: Number },
    pricePrivate: { type: Number },
    imageUrl: { type: String },
    cloudinaryPublicId: { type: String },
    viewCount: { type: Number, default: 0 },

    // ⭐ Add review stats (optional)
    avgRating: { type: Number, default: 0 }, // Average rating (e.g., 4.3)
    totalReviews: { type: Number, default: 0 }, // Total number of reviews

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);
