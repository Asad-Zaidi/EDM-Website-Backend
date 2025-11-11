const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
    console.error('❌ No MongoDB URI found');
    process.exit(1);
}

mongoose.connect(mongoUri)
    .then(async () => {
        console.log('✅ MongoDB connected\n');
        
        // Test queries
        const testSlugs = [
            'social-media/social-media',
            'social-media/amazon-prime',
            'ai-tools/chatgpt',
            'entertainment/netflix'
        ];
        
        console.log('Testing slug queries:\n');
        
        for (const slug of testSlugs) {
            try {
                const product = await Product.findOne({ slug: slug });
                if (product) {
                    console.log(`✅ Found: ${slug}`);
                    console.log(`   Name: ${product.name}`);
                    console.log(`   Category: ${product.category}\n`);
                } else {
                    console.log(`❌ Not Found: ${slug}\n`);
                }
            } catch (err) {
                console.log(`❌ Error querying ${slug}: ${err.message}\n`);
            }
        }
        
        // Check all slugs in database
        console.log('\n--- All Slugs in Database ---\n');
        const allProducts = await Product.find({});
        allProducts.forEach((p, i) => {
            console.log(`${i + 1}. ${p.slug}`);
        });
        
        mongoose.disconnect();
    })
    .catch((err) => {
        console.error('❌ Connection error:', err.message);
        process.exit(1);
    });
