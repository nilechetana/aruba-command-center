/**
 * @file components/AuthCard/AuthCard.jsx
 * @description Glassmorphism card with animated Login/Sign Up tab switcher.
 * Sliding orange underline indicator and smooth 300ms fade+translate transition
 * between forms. Card entrance animation on page load.
 * @returns {JSX.Element}
 */

import React, { useState } from 'react';
import LoginForm from '../LoginForm/LoginForm';
import SignupForm from '../SignupForm/SignupForm';
import styles from './AuthCard.module.css';

const TABS = [
  { id: 'login', label: 'Sign In' },
  { id: 'signup', label: 'Sign Up' },
];

const AuthCard = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [successBanner, setSuccessBanner] = useState('');

  const handleSuccess = (message) => {
    setSuccessBanner(message);
    setActiveTab('login');
    setTimeout(() => setSuccessBanner(''), 4000);
  };

  const handleTabSwitch = (tabId) => {
    setActiveTab(tabId);
    setSuccessBanner('');
  };

  return (
    <div className={styles.card}>
      {/* Tab switcher */}
      <div className={styles.tabBar}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`${styles.tabButton} ${activeTab === tab.id ? styles.activeTab : ''}`}
            onClick={() => handleTabSwitch(tab.id)}
          >
            {tab.label}
          </button>
        ))}
        <span
          className={styles.tabIndicator}
          style={{ transform: `translateX(${activeTab === 'login' ? '0%' : '100%'})` }}
        />
      </div>

      {/* Success banner */}
      {successBanner && (
        <div className={styles.successBanner}>
          <span className={styles.successIcon}>✓</span>
          {successBanner}
        </div>
      )}

      {/* Form panels */}
      <div className={styles.formArea}>
        <div className={`${styles.formPanel} ${activeTab === 'login' ? styles.visible : styles.hidden}`}>
          <LoginForm onSuccess={handleSuccess} />
        </div>
        <div className={`${styles.formPanel} ${activeTab === 'signup' ? styles.visible : styles.hidden}`}>
          <SignupForm onSuccess={handleSuccess} />
        </div>
      </div>

      {/* Footer switch prompt */}
      <p className={styles.switchPrompt}>
        {activeTab === 'login' ? (
          <>
            Don&apos;t have an account?{' '}
            <button type="button" className={styles.switchLink} onClick={() => handleTabSwitch('signup')}>
              Create one
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button type="button" className={styles.switchLink} onClick={() => handleTabSwitch('login')}>
              Sign in
            </button>
          </>
        )}
      </p>

      {/* Secure connection badge */}
      <div className={styles.secureBadge}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        256-bit SSL encrypted &amp; secure
      </div>
    </div>
  );
};

export default AuthCard;
