// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');

// const authRoutes = require('./routes/authRoutes');
// const productRoutes = require('./routes/productRoutes');
// // const contactRoutes = require("./routes/contactRoutes");
// // const messageRoutes = require("./routes/messageRoutes");
// const adminRoutes = require("./routes/adminRoutes");
// const reviewRoutes = require('./routes/reviewRoutes');
// const bannerRoutes = require("./routes/bannerRoutes");
// const visitTracker = require('./middlewares/visitTracker');
// const categoryRoutes = require("./routes/categoryRoutes");

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.use(visitTracker);

// app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes);
// app.use("/api/admin", adminRoutes);
// // app.use("/api/contact", contactRoutes);
// // app.use("/api/messages", messageRoutes);
// app.use("/api/reviews", reviewRoutes);
// app.use("/api/banners", bannerRoutes);
// app.use("/api/categories", categoryRoutes);

// const PORT = process.env.PORT || 5000;

// mongoose.connect(process.env.MONGODB_URI).then(() => {
//     console.log('MongoDB connected');
//     app.listen(PORT, () => console.log('Server running on port', PORT));
// }).catch(err => {
//     console.error('DB connection error:', err);
// });

// app.use((req, res) => {
//     res.status(404).json({ message: 'Respone OK' });
// });
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const adminRoutes = require("./routes/adminRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const visitTracker = require("./middlewares/visitTracker");

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(visitTracker);

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/categories", categoryRoutes);

app.use((req, res) => {
    res.status(404).json({ message: "Response OK" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));