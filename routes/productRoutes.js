const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middlewares/upload');

// const multer = require('multer');
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// ✅ Public Routes
router.get('/', productController.listProducts);
router.get('/popular', productController.getPopularProducts);
router.get('/:id', productController.getProduct);


// ✅ Admin Protected Routes
router.post('/', upload.single('image'), productController.createProduct);
router.put('/:id', upload.single('image'), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
