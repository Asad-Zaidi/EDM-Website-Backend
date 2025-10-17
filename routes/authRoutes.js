const express = require('express');
const router = express.Router();
const { registerAdmin, login } = require('../controllers/authController');

// Only call registerAdmin once to create the first admin (or create admin via MongoDB Atlas UI).
router.post('/register', registerAdmin);
router.post('/login', login);

module.exports = router;
