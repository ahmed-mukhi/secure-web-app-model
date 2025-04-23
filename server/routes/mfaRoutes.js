// /routes/mfaRoutes.js
const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP } = require('../controllers/mfaController');

// Route to send OTP
router.post('/send-otp', sendOTP);

// Route to verify OTP
router.post('/verify-otp', verifyOTP);

module.exports = router;
