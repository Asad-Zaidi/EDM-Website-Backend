const mongoose = require("mongoose");

const connectDB = async (retries = 5, delay = 5000) => {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!uri) {
        console.error("MongoDB URI not found in environment variables!");
        process.exit(1);
    }

    try {
        await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    } catch (error) {
        console.error(`Database Connection Error: ${error.message}`);

        if (retries > 0) {
            console.log(`🔁 Retrying in ${delay / 10000}s... (${retries} retries left)`);
            setTimeout(() => connectDB(retries - 1, delay), delay);
        } else {
            console.error("All retry attempts failed. Exiting process.");
            process.exit(1);
        }
    }
};

mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected. Attempting to reconnect...");
    connectDB();
});

module.exports = connectDB;
