// /controllers/mfaController.js
const User = require('../models/User');
const sendOTP = require('../utils/nodemailer');

// Store OTPs in-memory with expiry (using a timestamp)
let userOTP = {};  // Store OTPs keyed by user email for verification

// OTP Expiry Time (5 minutes from generation)
const OTP_EXPIRY_TIME = 5 * 60 * 1000;  // 5 minutes in milliseconds

// Generate a random 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000);  // 6-digit OTP
};

// Controller for sending OTP to user's email
exports.sendOTP = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    const otp = generateOTP();
    const expiresAt = Date.now() + OTP_EXPIRY_TIME;  // Calculate expiry time

    userOTP[email] = { otp, expiresAt };  // Store OTP with expiry

    try {
        await sendOTP(email, otp);
        return res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to send OTP', error: error });
    }
};

// Controller for verifying OTP
exports.verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    const storedOTP = userOTP[email];

    if (!storedOTP) {
        return res.status(400).json({ message: 'OTP not found for this email' });
    }

    // Check if OTP has expired
    if (Date.now() > storedOTP.expiresAt) {
        delete userOTP[email];  // Remove expired OTP
        return res.status(400).json({ message: 'OTP has expired' });
    }

    // Check if OTP matches
    if (storedOTP.otp === parseInt(otp)) {
        // OTP matched, proceed with authentication
        let user = User.findOne({ email });
        if (!user) res.status(400).json({ message: "User not found by email" });
        await User.updateOne({ email }, { $set: { isOtpVerified: true } });
        return res.status(200).json({ success: true, message: 'OTP verified successfully' });
    } else {
        return res.status(400).json({ message: 'Invalid OTP' });
    }
};
