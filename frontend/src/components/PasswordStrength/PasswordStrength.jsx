/**
 * @file components/PasswordStrength/PasswordStrength.jsx
 * @description Animated horizontal bar showing password strength level.
 * Displays Weak (red, 33%), Medium (orange, 66%), or Strong (green, 100%).
 * @param {Object} props
 * @param {string} props.password - The current password value to evaluate.
 * @returns {JSX.Element|null} Strength bar or null if password is empty.
 */

import React from 'react';
import { getPasswordStrength } from '../../utils/validators';
import styles from './PasswordStrength.module.css';

const STRENGTH_CONFIG = {
  1: { className: styles.weak, width: '33%', label: 'Weak' },
  2: { className: styles.medium, width: '66%', label: 'Medium' },
  3: { className: styles.strong, width: '100%', label: 'Strong' },
};

const PasswordStrength = ({ password }) => {
  const { score, label } = getPasswordStrength(password);
  if (!password || score === 0) return null;

  const config = STRENGTH_CONFIG[score];

  return (
    <div className={styles.wrapper}>
      <div className={styles.track}>
        <div
          className={`${styles.bar} ${config.className}`}
          style={{ width: config.width }}
        />
      </div>
      <span className={`${styles.label} ${config.className}`}>{label}</span>
    </div>
  );
};

export default PasswordStrength;
