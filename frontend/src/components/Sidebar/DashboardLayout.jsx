import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import Sidebar from '../Sidebar/Sidebar';
import NetworkBackground from '../NetworkBackground/NetworkBackground';
import styles from './DashboardLayout.module.css';

const DashboardLayout = () => {
  const { user } = useAuthContext();
  if (!user) return <Navigate to="/" replace />;

  return (
    <div className={styles.layout}>
      <NetworkBackground />
      <Sidebar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
