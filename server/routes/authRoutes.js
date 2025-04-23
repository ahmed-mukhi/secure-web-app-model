const express = require('express');
const router = express.Router();
const { register, login, profile, getSession } = require('../controllers/authController');
const { registerValidator, validate } = require('../middlewares/validate');
const auth = require('../middlewares/auth');

// Register
router.post('/register', registerValidator, validate, register);

// Login
router.post('/login', login);

// Protected route
router.get('/profile', auth, profile);

router.get('/session', getSession);

module.exports = router;
