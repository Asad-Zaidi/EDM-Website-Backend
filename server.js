// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import cors from "cors";
// import productRoutes from "./routes/productRoutes.js"; // ✅ Import routes

// dotenv.config();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // MongoDB connection
// mongoose
//     .connect(process.env.MONGODB_URI)
//     .then(() => console.log("✅ MongoDB Connected Successfully"))
//     .catch((err) => console.error("❌ DB connection error:", err));

// // Default test route
// app.get("/", (req, res) => {
//     res.json({ message: "✅ Backend is running successfully!" });
// });

// // ✅ Register product routes
// app.use("/api/products", productRoutes);

// // Server listen
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();
app.use(cors());
app.use(express.json()); // parse JSON bodies

// routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log('Server running on port', PORT));
}).catch(err => {
    console.error('DB connection error:', err);
});

app.use((req, res) => {
    res.status(404).json({ message: 'Respone OK' });
});