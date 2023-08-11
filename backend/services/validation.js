const { body, check, query } = require('express-validator');

// Validation Array
exports.registerValidate = [
    // Check Username
    body('username', 'Not a valid username')
        .trim()
        .notEmpty()
        .escape(),
    body('email', 'Not a valid email')
        .isEmail()
        .trim()
        .notEmpty()
        .escape(),
    // Check Password
    body('password')
        .trim()
        .isLength({ min: 8 })
        .withMessage('Password Must Be at Least 8 Characters')
        .matches('[0-9]')
        .withMessage('Password Must Contain a Number')
        .matches('[A-Z]')
        .withMessage('Password Must Contain an Uppercase Letter')
        .escape()
];

exports.loginValidate = [
    // Check Username
    body('username', 'Not a valid username')
        .trim()
        .notEmpty()
        .escape(),
    // Check Password
    body('password')
        .trim()
        .isLength({ min: 8 })
        .withMessage('Password Must Be at Least 8 Characters')
        .matches('[0-9]')
        .withMessage('Password Must Contain a Number')
        .matches('[A-Z]')
        .withMessage('Password Must Contain an Uppercase Letter')
        .escape()
];
