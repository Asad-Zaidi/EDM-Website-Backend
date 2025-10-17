const Product = require('../models/Product');
const cloudinary = require('../utils/cloudinary');

// Create product with image (multipart/form-data)
const createProduct = async (req, res) => {
    try {
        // expecting fields: name, priceMonthly, description, category
        const { name, priceMonthly, description, category } = req.body;

        let imageUrl = '', publicId = '';
        if (req.file) {
            // multer stored file in req.file.buffer (we will use multer.memoryStorage)
            const streamUpload = (buffer) => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: 'servicehub' },
                        (error, result) => {
                            if (result) resolve(result);
                            else reject(error);
                        }
                    );
                    stream.end(buffer);
                });
            };
            const result = await streamUpload(req.file.buffer);
            imageUrl = result.secure_url;
            publicId = result.public_id;
        }

        const priceMonthlyNum = Number(priceMonthly);
        const priceYearly = Math.round(priceMonthlyNum * 10); // example yearly calculation

        const product = await Product.create({
            name,
            priceMonthly: priceMonthlyNum,
            priceYearly,
            description,
            category,
            imageUrl,
            cloudinaryPublicId: publicId
        });

        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body; // name, priceMonthly, description, category optionally
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: 'Not found' });

        // if new file uploaded, remove old image and upload new
        if (req.file) {
            if (product.cloudinaryPublicId) {
                await cloudinary.uploader.destroy(product.cloudinaryPublicId);
            }
            const streamUpload = (buffer) => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: 'servicehub' },
                        (error, result) => {
                            if (result) resolve(result);
                            else reject(error);
                        }
                    );
                    stream.end(buffer);
                });
            };
            const result = await streamUpload(req.file.buffer);
            updates.imageUrl = result.secure_url;
            updates.cloudinaryPublicId = result.public_id;
        }

        if (updates.priceMonthly) {
            updates.priceYearly = Math.round(Number(updates.priceMonthly) * 10);
        }

        const updated = await Product.findByIdAndUpdate(id, updates, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: 'Not found' });

        if (product.cloudinaryPublicId) {
            await cloudinary.uploader.destroy(product.cloudinaryPublicId);
        }
        await product.remove();
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const listProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getProduct = async (req, res) => {
    try {
        const p = await Product.findById(req.params.id);
        if (!p) return res.status(404).json({ message: 'Not found' });
        res.json(p);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { createProduct, updateProduct, deleteProduct, listProducts, getProduct };
