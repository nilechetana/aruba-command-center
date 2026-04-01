/**
 * @file components/LoginForm/LoginForm.jsx
 * @description Login form with email, password, remember me checkbox,
 * show/hide password toggle, and inline validation on blur and submit.
 * @param {Object} props
 * @param {Function} props.onSuccess - Callback invoked after successful login.
 * @returns {JSX.Element}
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../InputField/InputField';
import useForm from '../../hooks/useForm';
import useAuth from '../../hooks/useAuth';
import { useAuthContext } from '../../context/AuthContext';
import { validateEmail, validatePassword } from '../../utils/validators';
import styles from './LoginForm.module.css';

const INITIAL_VALUES = { email: '', password: '', rememberMe: false };

/**
 * Validates all login form fields.
 * @param {Object} values - Current form values.
 * @returns {Object} Map of field names to error strings.
 */
const validateLoginForm = (values) => {
  const errors = {};
  const emailError = validateEmail(values.email);
  const passwordError = validatePassword(values.password);
  if (emailError) errors.email = emailError;
  if (passwordError) errors.password = passwordError;
  return errors;
};

const EyeIcon = ({ visible }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    {visible ? (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    ) : (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    )}
  </svg>
);

const LoginForm = ({ onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useForm(INITIAL_VALUES, validateLoginForm);
  const { loading, successMessage, errorMessage, submitLogin } = useAuth();
  const { login } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem('aruba_remembered_email');
    if (savedEmail) {
      handleChange({ target: { name: 'email', value: savedEmail, type: 'text' } });
      handleChange({ target: { name: 'rememberMe', value: true, type: 'checkbox', checked: true } });
    }
  }, []);

  useEffect(() => {
    if (successMessage) {
      if (onSuccess) onSuccess(successMessage);
      login({ name: values.email.split('@')[0], email: values.email });
      navigate('/dashboard');
    }
  }, [successMessage]); // eslint-disable-line

  const onSubmit = async (formValues) => {
    if (formValues.rememberMe) {
      localStorage.setItem('aruba_remembered_email', formValues.email);
    } else {
      localStorage.removeItem('aruba_remembered_email');
    }
    await submitLogin(formValues.email, formValues.password);
  };

  const handleInvalidSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validateLoginForm(values);
    if (Object.keys(validationErrors).length > 0) {
      setShakeKey((prev) => prev + 1);
    }
    handleSubmit(onSubmit)(event);
  };

  return (
    <form className={`${styles.form} ${shakeKey > 0 && Object.keys(errors).length > 0 ? styles.shake : ''}`} key={shakeKey} onSubmit={handleInvalidSubmit} noValidate>
      <InputField
        label="Email Address"
        type="email"
        name="email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.email && errors.email}
        placeholder="you@example.com"
        icon={
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        }
      />

      <InputField
        label="Password"
        type={showPassword ? 'text' : 'password'}
        name="password"
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.password && errors.password}
        placeholder="Min. 8 characters"
        icon={
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        }
        rightElement={
          <span onClick={() => setShowPassword((prev) => !prev)}>
            <EyeIcon visible={showPassword} />
          </span>
        }
      />

      <div className={styles.rememberRow}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="rememberMe"
            checked={values.rememberMe}
            onChange={handleChange}
            className={styles.checkbox}
          />
          <span className={styles.checkmark} />
          Remember me
        </label>
        <button type="button" className={styles.forgotLink}>Forgot password?</button>
      </div>

      {errorMessage && <p className={styles.apiError}>{errorMessage}</p>}
      {successMessage && <p className={styles.apiSuccess}>{successMessage}</p>}

      <button type="submit" className={styles.submitButton} disabled={loading}>
        {loading ? <span className={styles.spinner} /> : 'Sign In'}
      </button>
    </form>
  );
};

export default LoginForm;
