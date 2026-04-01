/**
 * @file components/InputField/InputField.jsx
 * @description Reusable form input component with label, icon support,
 * right-side element slot (e.g. show/hide toggle), and animated error message.
 * @param {Object} props
 * @param {string} props.label - Input label text.
 * @param {string} props.type - HTML input type.
 * @param {string} props.name - Input name attribute.
 * @param {string} props.value - Controlled input value.
 * @param {Function} props.onChange - Change handler.
 * @param {Function} props.onBlur - Blur handler.
 * @param {string} [props.error] - Error message to display.
 * @param {string} [props.placeholder] - Placeholder text.
 * @param {React.ReactNode} [props.icon] - Left icon element.
 * @param {React.ReactNode} [props.rightElement] - Right slot element (e.g. eye toggle).
 * @returns {JSX.Element}
 */

import React from 'react';
import styles from './InputField.module.css';

const InputField = ({ label, type, name, value, onChange, onBlur, error, placeholder, icon, rightElement }) => {
  return (
    <div className={styles.fieldWrapper}>
      {label && <label className={styles.label} htmlFor={name}>{label}</label>}
      <div className={`${styles.inputContainer} ${error ? styles.hasError : ''}`}>
        {icon && <span className={styles.iconLeft}>{icon}</span>}
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`${styles.input} ${icon ? styles.withIcon : ''} ${rightElement ? styles.withRight : ''}`}
          autoComplete="off"
        />
        {rightElement && <span className={styles.iconRight}>{rightElement}</span>}
      </div>
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
};

export default InputField;
