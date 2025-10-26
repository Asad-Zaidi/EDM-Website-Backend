const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Visit = require('../models/Visit');
const productController = require('../controllers/productController');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Public Routes
router.get('/', productController.listProducts);
router.get('/:id', productController.getProduct);

// ✅ NEW: Popular Products Route
router.get('/popular/top', async (req, res) => {
    try {
        const popular = await Visit.aggregate([
            { $match: { page: { $regex: '^/products/', $options: 'i' } } },
            { $group: { _id: "$page", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        const ids = popular.map(p => p._id.split('/products/')[1]);
        const products = await Product.find({ _id: { $in: ids } });
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 👇 Fetch top 6 popular products based on view count
router.get("/popular", async (req, res) => {
    try {
        const products = await Product.find()
            .sort({ viewCount: -1 })
            .limit(6);
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// ✅ Admin Protected Routes
router.post('/', upload.single('image'), productController.createProduct);
router.put('/:id', upload.single('image'), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
