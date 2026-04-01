/**
 * @file middleware/errorHandler.js
 * @description Global catch-all error handling middleware for Express.
 * Catches any unhandled errors and returns a standardized 500 response.
 * Must be registered as the last middleware in server.js.
 * @param {Error} err - The error object passed via next(err).
 * @param {import('express').Request} _req - Express request object (unused).
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} _next - Express next function (unused but required by Express).
 */
const errorHandler = (err, _req, res, _next) => {
  console.error('Unhandled error:', err.message || err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};

module.exports = errorHandler;
