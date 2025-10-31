const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const reviewController = require('../controllers/reviewController');
const upload = require('../middlewares/upload');
const Product = require('../models/Product');

router.get('/', productController.listProducts);
router.get('/popular', productController.getPopularProducts);
router.get('/:id', productController.getProduct);

router.get("/slug/:slug", async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug });
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.get('/reviews/slug/:slug', reviewController.getReviewsByProductSlug);


router.post('/', upload.single('image'), productController.createProduct);
router.put('/:id', upload.single('image'), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
