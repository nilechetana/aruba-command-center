/**
 * @file routes/authRoutes.js
 * @description Express router defining authentication endpoints.
 * Applies validation middleware before passing to controllers.
 */

const express = require('express');
const { register, login } = require('../controllers/authController');
const {
  registerValidationRules,
  loginValidationRules,
  handleValidationErrors,
} = require('../middleware/validateRequest');

const router = express.Router();

/**
 * POST /api/auth/register
 * Registers a new user account.
 * Body: { name, email, phone?, password }
 */
router.post('/register', registerValidationRules, handleValidationErrors, register);

/**
 * POST /api/auth/login
 * Authenticates an existing user.
 * Body: { email, password }
 */
router.post('/login', loginValidationRules, handleValidationErrors, login);

module.exports = router;
