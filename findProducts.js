const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

// Try different database URIs
const dbUris = [
    process.env.MONGODB_URI,
    'mongodb+srv://asad_db_user:1410@cluster0.dc3ncyk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    'mongodb+srv://asad_db_user:1410@cluster0.dc3ncyk.mongodb.net/edmDB?retryWrites=true&w=majority&appName=Cluster0'
];

const checkDatabase = async (uri, name) => {
    try {
        await mongoose.connect(uri);
        console.log(`\n✅ Connected to: ${name}`);
        
        const products = await Product.find({});
        console.log(`   Products found: ${products.length}`);
        
        if (products.length > 0) {
            console.log('   First product:');
            console.log(`     Name: ${products[0].name}`);
            console.log(`     Slug: ${products[0].slug}`);
        }
        
        await mongoose.disconnect();
        return products.length;
    } catch (err) {
        console.log(`❌ ${name}: Connection failed`);
        return 0;
    }
};

const main = async () => {
    for (let i = 0; i < dbUris.length; i++) {
        if (dbUris[i]) {
            const shortUri = dbUris[i].substring(0, 70) + '...';
            await checkDatabase(dbUris[i], `URI ${i + 1}: ${shortUri}`);
        }
    }
};

main().then(() => {
    console.log('\n✅ Database check complete');
    process.exit(0);
});
