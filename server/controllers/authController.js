const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { hashPassword, comparePassword } = require('../utils/hash');

exports.register = async (req, res) => {
    try {
        const { email, password, name, age } = req.body;
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: 'User already exists' });

        const hashed = await hashPassword(password);
        const user = await User.create({ email, password: hashed, name, age });

        res.status(201).json({ message: 'User created', userId: user._id });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log(token);
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        });

        res.json({ success: true, message: 'Login successful' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};



// ✅ /api/auth/session
exports.getSession = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.json({ authenticated: false });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.json({ authenticated: false });
        console.log({
            authenticated: true,
            otpVerified: user.isOtpVerified || false, // store this field after OTP
        });

        return res.json({
            authenticated: true,
            otpVerified: user.isOtpVerified || false, // store this field after OTP
        });
    } catch (err) {
        return res.json({ authenticated: false });
    }
};


exports.profile = async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
};
