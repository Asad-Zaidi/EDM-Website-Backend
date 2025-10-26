const Banner = require("../models/Banner");
const cloudinary = require("../utils/cloudinary");

// 📤 Create new banner
const createBanner = async (req, res) => {
    try {
        const { title, subtitle, link } = req.body;
        let imageUrl = "";
        let cloudinaryPublicId = "";

        if (req.file) {
            const streamUpload = (buffer) => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: "servicehub/banners" },
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
            cloudinaryPublicId = result.public_id;
        }

        const banner = await Banner.create({
            title,
            subtitle,
            link,
            imageUrl,
            cloudinaryPublicId,
            isActive: true,
        });

        res.json(banner);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 📋 Get all banners
const getBanners = async (req, res) => {
    try {
        const banners = await Banner.find().sort({ createdAt: -1 });
        res.json(banners);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🧹 Delete banner
const deleteBanner = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) return res.status(404).json({ message: "Banner not found" });

        // Try to remove image from Cloudinary if public id exists.
        if (banner.cloudinaryPublicId) {
            try {
                await cloudinary.uploader.destroy(banner.cloudinaryPublicId);
            } catch (cloudErr) {
                // Log cloudinary error but continue with DB deletion to avoid blocking admin actions
                console.error("Cloudinary destroy error:", cloudErr);
            }
        }

        // Use deleteOne to remove document (avoid deprecated remove())
        await banner.deleteOne();
        res.json({ message: "Banner deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🔁 Toggle banner active status
const toggleBannerStatus = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) return res.status(404).json({ message: "Banner not found" });

        banner.isActive = !banner.isActive;
        await banner.save();

        res.json(banner);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { createBanner, getBanners, deleteBanner, toggleBannerStatus };
