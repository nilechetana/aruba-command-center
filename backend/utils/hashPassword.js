/**
 * @file utils/hashPassword.js
 * @description Utility functions for hashing and comparing passwords using bcryptjs.
 */

const bcrypt = require('bcryptjs');

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10;

/**
 * Hashes a plain-text password using bcrypt.
 * @param {string} plainPassword - The raw password string to hash.
 * @returns {Promise<string>} The bcrypt hashed password.
 */
const hashPassword = async (plainPassword) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(plainPassword, salt);
};

/**
 * Compares a plain-text password against a stored bcrypt hash.
 * @param {string} plainPassword - The raw password to verify.
 * @param {string} hashedPassword - The stored bcrypt hash to compare against.
 * @returns {Promise<boolean>} True if the passwords match, false otherwise.
 */
const comparePassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = { hashPassword, comparePassword };
