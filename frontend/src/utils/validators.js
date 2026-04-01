/**
 * @file utils/validators.js
 * @description Pure validation utility functions for all form fields.
 * Each function returns an error string or empty string if valid.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REGEX = /^[a-zA-Z\s]{3,}$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;

/**
 * Validates an email address format.
 * @param {string} value - The email string to validate.
 * @returns {string} Error message or empty string if valid.
 * @example
 * validateEmail('user@example.com') // ''
 * validateEmail('bad-email')        // 'Please enter a valid email address.'
 */
export const validateEmail = (value) => {
  if (!value || !value.trim()) return 'Email is required.';
  if (!EMAIL_REGEX.test(value.trim())) return 'Please enter a valid email address.';
  return '';
};

/**
 * Validates a password meets minimum security requirements.
 * @param {string} value - The password string to validate.
 * @returns {string} Error message or empty string if valid.
 * @example
 * validatePassword('Secret@1') // ''
 * validatePassword('abc')      // 'Password must be at least 8 characters.'
 */
export const validatePassword = (value) => {
  if (!value) return 'Password is required.';
  if (value.length < 8) return 'Password must be at least 8 characters.';
  return '';
};

/**
 * Validates a full name — letters and spaces only, min 3 chars.
 * @param {string} value - The name string to validate.
 * @returns {string} Error message or empty string if valid.
 * @example
 * validateName('Jane Doe') // ''
 * validateName('J9')       // 'Name must be at least 3 characters (letters and spaces only).'
 */
export const validateName = (value) => {
  if (!value || !value.trim()) return 'Full name is required.';
  if (!NAME_REGEX.test(value.trim())) return 'Name must be at least 3 characters (letters and spaces only).';
  return '';
};

/**
 * Validates an optional Indian 10-digit phone number.
 * Starting digit must be 6, 7, 8, or 9 as per Indian mobile numbering plan.
 * @param {string} value - The phone string to validate.
 * @returns {string} Error message or empty string if valid or empty.
 * @example
 * validatePhone('9876543210') // ''
 * validatePhone('1234567890') // 'Enter a valid 10-digit Indian mobile number.'
 * validatePhone('')           // '' (optional field)
 */
export const validatePhone = (value) => {
  if (!value || !value.trim()) return '';
  if (!PHONE_REGEX.test(value.trim())) return 'Enter a valid 10-digit Indian mobile number.';
  return '';
};

/**
 * Validates that confirm password matches the original password.
 * @param {string} password - The original password.
 * @param {string} confirmPassword - The confirmation password.
 * @returns {string} Error message or empty string if they match.
 * @example
 * validateConfirmPassword('Secret@1', 'Secret@1') // ''
 * validateConfirmPassword('Secret@1', 'other')    // 'Passwords do not match.'
 */
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return 'Please confirm your password.';
  if (password !== confirmPassword) return 'Passwords do not match.';
  return '';
};

/**
 * Calculates password strength based on four complexity conditions:
 * uppercase letter, lowercase letter, digit, and special character.
 * @param {string} password - The password to evaluate.
 * @returns {{ score: number, label: string }} Score 0–3 and human-readable label.
 * @example
 * getPasswordStrength('abc')        // { score: 1, label: 'Weak' }
 * getPasswordStrength('Abc1')        // { score: 2, label: 'Medium' }
 * getPasswordStrength('Abc1@xyz')    // { score: 3, label: 'Strong' }
 */
export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: '' };
  const conditions = [
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const metCount = conditions.filter(Boolean).length;
  if (metCount <= 1) return { score: 1, label: 'Weak' };
  if (metCount <= 3) return { score: 2, label: 'Medium' };
  return { score: 3, label: 'Strong' };
};
