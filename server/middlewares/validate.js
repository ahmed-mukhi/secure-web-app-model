// /src/middlewares/validate.js
const { body, validationResult } = require('express-validator');

exports.registerValidator = [
    // Email validation
    body('email').isEmail().withMessage('Invalid email'),

    // Password validation: applying the strong password policy
    body('password')
        .isLength({ min: 8, max: 20 }).withMessage('Password must be between 8 and 20 characters')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/\d/).withMessage('Password must contain at least one digit')
        .matches(/[@$!%*?&]/).withMessage('Password must contain at least one special character (@$!%*?&)') // You can change this to your preferred special characters
        .not().matches(/\s/).withMessage('Password must not contain spaces'),
];

// Middleware to validate errors
exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
};
