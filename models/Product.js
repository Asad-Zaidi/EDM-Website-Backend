// const mongoose = require('mongoose');

// const ProductSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     priceMonthly: { type: Number, required: true }, 
//     priceYearly: { type: Number }, 
//     description: { type: String },
//     category: { type: String },
//     imageUrl: { type: String },
//     cloudinaryPublicId: { type: String }, 
//     createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Product', ProductSchema);

const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },

    // 💰 Pricing fields (all optional so admin can choose what to add)
    priceMonthly: { type: Number },
    priceYearly: { type: Number },
    priceShared: { type: Number },
    pricePrivate: { type: Number },

    // 📸 Image fields
    imageUrl: { type: String },
    cloudinaryPublicId: { type: String },

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);
