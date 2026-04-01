/**
 * @file hooks/useAuth.js
 * @description Custom hook that wraps authentication API calls with loading,
 * success, and error state management.
 * @returns {{ loading, successMessage, errorMessage, submitLogin, submitRegister, clearMessages }}
 */

import { useState, useCallback } from 'react';
import { loginUser, registerUser } from '../services/authService';

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const clearMessages = useCallback(() => {
    setSuccessMessage('');
    setErrorMessage('');
  }, []);

  /**
   * Submits login credentials to the API.
   * @param {string} email - User email.
   * @param {string} password - User password.
   */
  const submitLogin = useCallback(async (email, password) => {
    setLoading(true);
    clearMessages();
    try {
      const data = await loginUser(email, password);
      setSuccessMessage(data.message || 'Login successful!');
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  }, [clearMessages]);

  /**
   * Submits registration data to the API.
   * @param {string} name - User full name.
   * @param {string} email - User email.
   * @param {string} phone - User phone (optional).
   * @param {string} password - User password.
   */
  const submitRegister = useCallback(async (name, email, phone, password) => {
    setLoading(true);
    clearMessages();
    try {
      const data = await registerUser(name, email, phone, password);
      setSuccessMessage(data.message || 'Account created successfully!');
    } catch (err) {
      const backendErrors = err.response?.data?.errors;
      if (backendErrors && backendErrors.length > 0) {
        setErrorMessage(backendErrors[0].message);
      } else {
        setErrorMessage(err.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [clearMessages]);

  return { loading, successMessage, errorMessage, submitLogin, submitRegister, clearMessages };
};

export default useAuth;
