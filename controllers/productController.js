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

        let imageUrl = "", publicId = "";


        if (req.file) {
            console.log("🖼 Uploading image to Cloudinary...");

            const streamUpload = (buffer) => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: "servicehub" },
                        (error, result) => {
                            if (result) resolve(result);
                            else reject(error);
                        }
                    );
                    stream.end(buffer);
                });
            };

            try {
                const result = await streamUpload(req.file.buffer);
                imageUrl = result.secure_url;
                publicId = result.public_id;
                console.log("✅ Cloudinary Upload Success:", result.secure_url);
            } catch (uploadError) {
                console.error("❌ Cloudinary Upload Failed:", uploadError);
                return res.status(500).json({ message: "Image upload failed", error: uploadError.message });
            }
        } else {
            console.log("⚠️ No image file provided — skipping Cloudinary upload.");
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

        console.log("✅ Product Created Successfully:", product.name);
        res.json(product);
    } catch (err) {
        console.error("❌ Product Creation Error:", err);
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
                        (error, result) => (result ? resolve(result) : reject(error))
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
        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

const listProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .sort({ createdAt: -1 })
            .select("name category priceMonthly imageUrl avgRating totalReviews");
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};



const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        product.viewCount = (product.viewCount || 0) + 1;
        await product.save();

        const response = {
            ...product._doc,
            price: product.priceMonthly || product.priceYearly || 0,
            avgRating: product.avgRating || 0,
            totalReviews: product.totalReviews || 0,
        };

        res.json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

const getPopularProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .sort({ viewCount: -1 })
            .limit(6);
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching popular products:", error);
        res.status(500).json({ message: "Failed to fetch popular products" });
    }
};


module.exports = {
    getPopularProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    listProducts,
    getProduct,

};
