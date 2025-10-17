const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    priceMonthly: { type: Number, required: true }, // base monthly price (in PKR or chosen currency)
    priceYearly: { type: Number }, // optional pre-calculated yearly price
    description: { type: String },
    category: { type: String },
    imageUrl: { type: String },
    cloudinaryPublicId: { type: String }, // to remove from Cloudinary if deleting
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);
