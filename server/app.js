const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const csrf = require('./middlewares/csrf');
const authRoutes = require('./routes/authRoutes');
const mfaRoutes = require('./routes/mfaRoutes');
const fs = require('fs');
const https = require('https');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

dotenv.config();
connectDB();

const app = express();

// Security middleware
app.use(cookieParser());
app.use(helmet());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());

// Rate limiting and logging
app.use(morgan('dev'));
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
}));

// CSRF middleware - cookie-based
// app.use(csrf);

// Routes
app.get('/api/csrf-token', csrf, (req, res) => {
    const token = req.csrfToken();

    // Send token in response body, not cookie
    res.status(200).json({ csrfToken: token });
});


app.use('/api/auth', authRoutes);
app.use('/api/mfa', mfaRoutes);

// HTTPS server
const sslOptions = {
    key: fs.readFileSync('localhost.key'),
    cert: fs.readFileSync('localhost.crt')
};

const PORT = process.env.PORT || 4433;
https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`✅ HTTPS Server running at https://localhost:${PORT}`);
});
