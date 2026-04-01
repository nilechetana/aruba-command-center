import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NetworkBackground from './components/NetworkBackground/NetworkBackground';
import AuthCard from './components/AuthCard/AuthCard';
import DashboardLayout from './components/Sidebar/DashboardLayout';
import Dashboard from './pages/Dashboard';
import NetworkMap from './pages/NetworkMap';
import Devices from './pages/Devices';
import Settings from './pages/Settings';
import styles from './App.module.css';

const AuthPage = () => (
  <div className={styles.appContainer}>
    <NetworkBackground />
    <main className={styles.mainContent}>
      <div className={styles.brandHeader}>
        <span className={styles.brandIcon}>◈</span>
        <span className={styles.brandName}>ARUBA</span>
        <span className={styles.brandSub}>COMMAND CENTER</span>
      </div>
      <AuthCard />
    </main>
    <footer className={styles.footer}>
      Built with React.js &amp; Node.js · Aruba Command Center © {new Date().getFullYear()}
    </footer>
  </div>
);

const App = () => (
  <Routes>
    <Route path="/" element={<AuthPage />} />
    <Route element={<DashboardLayout />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/network" element={<NetworkMap />} />
      <Route path="/devices" element={<Devices />} />
      <Route path="/settings" element={<Settings />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
