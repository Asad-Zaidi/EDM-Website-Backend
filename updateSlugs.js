const mongoose = require('mongoose');
const Product = require('./models/Product'); // adjust path if needed
require('dotenv').config();

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!mongoUri) {
    console.error('❌ No MongoDB URI found in environment variables');
    process.exit(1);
}

mongoose.connect(mongoUri)
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });

// Function to generate slug with category
const generateSlug = (name, category) => {
    const nameSlug = name
        .toLowerCase()
        .replace(/\s+/g, '-')      // replace spaces with hyphens
        .replace(/[^\w-]/g, '')    // remove special chars but keep hyphens
        .replace(/-+/g, '-')       // replace multiple hyphens with single
        .replace(/^-+|-+$/g, '');  // remove leading/trailing hyphens
    
    const categorySlug = category
        .toLowerCase()
        .replace(/\s+/g, '-')      // replace spaces with hyphens
        .replace(/[^\w-]/g, '')    // remove special chars but keep hyphens
        .replace(/-+/g, '-')       // replace multiple hyphens with single
        .replace(/^-+|-+$/g, '');  // remove leading/trailing hyphens
    
    return `${categorySlug}/${nameSlug}`;
};

const updateSlugs = async () => {
    try {
        const products = await Product.find({});
        for (let product of products) {
            const newSlug = generateSlug(product.name, product.category);
            if (product.slug !== newSlug) {
                product.slug = newSlug;
                await product.save();
                console.log(`✅ Updated slug for: ${product.name} → ${product.slug}`);
            }
        }
        console.log('✅ All products updated');
        mongoose.disconnect();
    } catch (err) {
        console.error('❌ Error updating slugs:', err);
        mongoose.disconnect();
    }
};

updateSlugs();
