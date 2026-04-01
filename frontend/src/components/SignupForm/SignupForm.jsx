/**
 * @file components/SignupForm/SignupForm.jsx
 * @description Registration form with full name, email, phone, password,
 * confirm password, password strength indicator, and show/hide toggles.
 * @param {Object} props
 * @param {Function} props.onSuccess - Callback invoked after successful registration.
 * @returns {JSX.Element}
 */

import React, { useState, useEffect } from 'react';
import InputField from '../InputField/InputField';
import PasswordStrength from '../PasswordStrength/PasswordStrength';
import useForm from '../../hooks/useForm';
import useAuth from '../../hooks/useAuth';
import { validateName, validateEmail, validatePhone, validatePassword, validateConfirmPassword } from '../../utils/validators';
import styles from './SignupForm.module.css';

const INITIAL_VALUES = { name: '', email: '', phone: '', password: '', confirmPassword: '', agreeToTerms: false };

/**
 * Validates all signup form fields.
 * @param {Object} values - Current form values.
 * @returns {Object} Map of field names to error strings.
 */
const validateSignupForm = (values) => {
  const errors = {};
  const nameError = validateName(values.name);
  const emailError = validateEmail(values.email);
  const phoneError = validatePhone(values.phone);
  const passwordError = validatePassword(values.password);
  const confirmError = validateConfirmPassword(values.password, values.confirmPassword);

  if (nameError) errors.name = nameError;
  if (emailError) errors.email = emailError;
  if (phoneError) errors.phone = phoneError;
  if (passwordError) errors.password = passwordError;
  if (confirmError) errors.confirmPassword = confirmError;

  // Check all four password complexity conditions (uppercase, lowercase, digit, special char)
  if (!passwordError && values.password) {
    const hasUppercase = /[A-Z]/.test(values.password);
    const hasLowercase = /[a-z]/.test(values.password);
    const hasDigit    = /[0-9]/.test(values.password);
    const hasSpecial  = /[^A-Za-z0-9]/.test(values.password);
    if (!hasUppercase || !hasLowercase || !hasDigit || !hasSpecial) {
      errors.password = 'Password must include uppercase, lowercase, number, and special character.';
    }
  }

  // Terms acceptance is mandatory
  if (!values.agreeToTerms) {
    errors.agreeToTerms = 'You must accept the Terms & Conditions to continue.';
  }

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

const SignupForm = ({ onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useForm(INITIAL_VALUES, validateSignupForm);
  const { loading, successMessage, errorMessage, submitRegister } = useAuth();

  // Notify parent of success; onSuccess ref avoids stale closure on re-renders
  useEffect(() => {
    if (successMessage && onSuccess) onSuccess(successMessage);
  }, [successMessage, onSuccess]);

  const onSubmit = async (formValues) => {
    await submitRegister(formValues.name, formValues.email, formValues.phone, formValues.password);
  };

  const handleInvalidSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validateSignupForm(values);
    if (Object.keys(validationErrors).length > 0) {
      setShakeKey((prev) => prev + 1);
    }
    handleSubmit(onSubmit)(event);
  };

  return (
    <form className={`${styles.form} ${shakeKey > 0 && Object.keys(errors).length > 0 ? styles.shake : ''}`} key={shakeKey} onSubmit={handleInvalidSubmit} noValidate>
      <InputField
        label="Full Name"
        type="text"
        name="name"
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.name && errors.name}
        placeholder="John Doe"
        icon={
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        }
      />

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
        label="Phone Number (Optional)"
        type="tel"
        name="phone"
        value={values.phone}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.phone && errors.phone}
        placeholder="9876543210"
        icon={
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        }
      />

      <div className={styles.passwordGroup}>
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
        <PasswordStrength password={values.password} />
      </div>

      <InputField
        label="Confirm Password"
        type={showConfirm ? 'text' : 'password'}
        name="confirmPassword"
        value={values.confirmPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.confirmPassword && errors.confirmPassword}
        placeholder="Re-enter your password"
        icon={
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        }
        rightElement={
          <span onClick={() => setShowConfirm((prev) => !prev)}>
            <EyeIcon visible={showConfirm} />
          </span>
        }
      />

      {/* Terms & Conditions checkbox — required before account creation */}
      <label className={styles.termsLabel}>
        <input
          type="checkbox"
          name="agreeToTerms"
          checked={values.agreeToTerms}
          onChange={handleChange}
          className={styles.termsCheckbox}
        />
        <span className={styles.termsCheckmark} />
        <span>
          I agree to the{' '}
          <button type="button" className={styles.termsLink}>Terms &amp; Conditions</button>
          {' '}and{' '}
          <button type="button" className={styles.termsLink}>Privacy Policy</button>
        </span>
      </label>
      {touched.agreeToTerms && errors.agreeToTerms && (
        <p className={styles.termsError}>{errors.agreeToTerms}</p>
      )}

      {errorMessage && <p className={styles.apiError}>{errorMessage}</p>}
      {successMessage && <p className={styles.apiSuccess}>{successMessage}</p>}

      <button type="submit" className={styles.submitButton} disabled={loading}>
        {loading ? <span className={styles.spinner} /> : 'Create Account'}
      </button>
    </form>
  );
};

export default SignupForm;
