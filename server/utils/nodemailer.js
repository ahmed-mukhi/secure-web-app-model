// /utils/nodemailer.js
const nodemailer = require('nodemailer');
require('dotenv').config()

// Configure Nodemailer with your email provider's SMTP settings
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,  // Your email
        pass: process.env.PASSW    // Your email password
    }
});

// Send OTP via email
const sendOTP = (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otp}`
    };

    return transporter.sendMail(mailOptions);
};

module.exports = sendOTP;
