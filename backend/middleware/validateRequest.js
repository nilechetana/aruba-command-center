/**
 * @file middleware/validateRequest.js
 * @description Express-validator middleware chains for register and login routes.
 * Validates incoming request bodies and returns structured error responses.
 */

const { body, validationResult } = require('express-validator');

/**
 * Validation rules for the /register endpoint.
 * Validates name, email, and password fields.
 * @type {import('express-validator').ValidationChain[]}
 */
const registerValidationRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Full name is required.')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters.')
    .matches(/^[a-zA-Z\s]{3,}$/)
    .withMessage('Name must contain only letters and spaces.'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail(),

  body('phone')
    .optional({ checkFalsy: true })
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Phone must be a valid 10-digit Indian mobile number.'),

  body('password')
    .notEmpty()
    .withMessage('Password is required.')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters.'),
];

/**
 * Validation rules for the /login endpoint.
 * Validates email and password fields.
 * @type {import('express-validator').ValidationChain[]}
 */
const loginValidationRules = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required.'),
];

/**
 * Middleware that checks validation results and returns 400 if errors exist.
 * Must be placed after validation rule chains in the route definition.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

module.exports = { registerValidationRules, loginValidationRules, handleValidationErrors };
