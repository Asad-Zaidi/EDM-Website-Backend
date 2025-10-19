const Product = require('../models/Product');
const cloudinary = require('../utils/cloudinary');


const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            category,
            priceMonthly,
            priceYearly,
            priceShared,
            pricePrivate,
        } = req.body;

        let imageUrl = '', publicId = '';
        if (req.file) {
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

        const product = await Product.create({
            name,
            description,
            category,
            priceMonthly: priceMonthly ? Number(priceMonthly) : undefined,
            priceYearly: priceYearly ? Number(priceYearly) : undefined,
            priceShared: priceShared ? Number(priceShared) : undefined,
            pricePrivate: pricePrivate ? Number(pricePrivate) : undefined,
            imageUrl,
            cloudinaryPublicId: publicId,
        });

        res.json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};


const updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        let updates = req.body;


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


        ["priceMonthly", "priceYearly", "priceShared", "pricePrivate"].forEach((key) => {
            if (updates[key]) updates[key] = Number(updates[key]);
        });

        const updated = await Product.findByIdAndUpdate(id, updates, { new: true });
        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        if (product.cloudinaryPublicId) {
            await cloudinary.uploader.destroy(product.cloudinaryPublicId);
        }
        await Product.findByIdAndDelete(id);
        res.json({ message: "Product deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};


const listProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};
const getProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

module.exports = { createProduct, updateProduct, deleteProduct, listProducts, getProduct };