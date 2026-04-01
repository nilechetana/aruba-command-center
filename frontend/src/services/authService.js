/**
 * @file services/authService.js
 * @description API service layer for authentication requests.
 * Uses Axios with the base URL configured via environment variable.
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/auth`,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Sends a login request to the backend.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's plain-text password.
 * @returns {Promise<{ success: boolean, message: string, user: object }>}
 */
export const loginUser = async (email, password) => {
  const response = await apiClient.post('/login', { email, password });
  return response.data;
};

/**
 * Sends a registration request to the backend.
 * @param {string} name - The user's full name.
 * @param {string} email - The user's email address.
 * @param {string} phone - The user's phone number (optional).
 * @param {string} password - The user's plain-text password.
 * @returns {Promise<{ success: boolean, message: string, user: object }>}
 */
export const registerUser = async (name, email, phone, password) => {
  const response = await apiClient.post('/register', { name, email, phone, password });
  return response.data;
};
