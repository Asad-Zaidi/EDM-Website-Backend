const mongoose = require('mongoose');
const Product = require('./models/Product'); // adjust path if needed

// Connect to MongoDB
mongoose.connect('mongodb+srv://asad_db_user:1410@cluster0.dc3ncyk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Function to generate slug
const generateSlug = (name) => {
    return name
        .toLowerCase()
        .replace(/[\s\W-]+/g, '-') // replace spaces and special chars with -
        .replace(/^-+|-+$/g, '');  // remove leading/trailing -
};

const updateSlugs = async () => {
    try {
        const products = await Product.find({});
        for (let product of products) {
            if (!product.slug) {
                product.slug = generateSlug(product.name);
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
