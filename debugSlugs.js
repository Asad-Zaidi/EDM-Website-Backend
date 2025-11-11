const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!mongoUri) {
    console.error('❌ No MongoDB URI found in environment variables');
    process.exit(1);
}

mongoose.connect(mongoUri)
    .then(async () => {
        console.log('✅ MongoDB connected\n');
        
        const products = await Product.find({});
        console.log(`Total Products: ${products.length}\n`);
        console.log('Product Slugs in Database:');
        console.log('========================\n');
        
        products.forEach((p, index) => {
            console.log(`${index + 1}. Name: ${p.name}`);
            console.log(`   Category: ${p.category}`);
            console.log(`   Slug: ${p.slug}\n`);
        });
        
        mongoose.disconnect();
    })
    .catch((err) => {
        console.error('❌ Error:', err);
        process.exit(1);
    });
