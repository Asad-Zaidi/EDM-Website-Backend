const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const adminOnly = require('../middlewares/adminMiddleware');
const productController = require('../controllers/productController');
const multer = require('multer');

const storage = multer.memoryStorage(); // store in memory to upload to Cloudinary
const upload = multer({ storage });

// Public
router.get('/', productController.listProducts);
router.get('/:id', productController.getProduct);

// Admin protected
router.post('/', auth, adminOnly, upload.single('image'), productController.createProduct);
router.put('/:id', auth, adminOnly, upload.single('image'), productController.updateProduct);
router.delete('/:id', auth, adminOnly, productController.deleteProduct);

module.exports = router;
