import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import styles from './Dashboard.module.css';

const STATS = [
  { label: 'Active Devices', value: 142, delta: '+3', icon: '▣', color: 'blue' },
  { label: 'Network Uptime', value: '99.8%', delta: '+0.1%', icon: '◎', color: 'green' },
  { label: 'Alerts', value: 7, delta: '-2', icon: '⚠', color: 'orange' },
  { label: 'Bandwidth', value: '4.2 GB', delta: '+12%', icon: '⬡', color: 'purple' },
];

const ACTIVITY = [
  { time: '2m ago', msg: 'AP-Core-01 reconnected to cluster', type: 'success' },
  { time: '11m ago', msg: 'Firmware update pushed to 12 APs', type: 'info' },
  { time: '34m ago', msg: 'Rogue device detected on VLAN 20', type: 'warn' },
  { time: '1h ago', msg: 'Policy "Guest-Isolation" applied', type: 'info' },
  { time: '2h ago', msg: 'Switch SW-Floor3 CPU spike 91%', type: 'warn' },
  { time: '3h ago', msg: 'VPN tunnel to HQ restored', type: 'success' },
];

const TRAFFIC = [38, 55, 42, 70, 61, 88, 74, 95, 80, 67, 90, 78];

const StatCard = ({ label, value, delta, icon, color }) => (
  <div className={`${styles.statCard} ${styles[color]}`}>
    <div className={styles.statTop}>
      <span className={styles.statIcon}>{icon}</span>
      <span className={`${styles.statDelta} ${delta.startsWith('+') ? styles.up : styles.down}`}>{delta}</span>
    </div>
    <div className={styles.statValue}>{value}</div>
    <div className={styles.statLabel}>{label}</div>
    <div className={styles.statGlow} />
  </div>
);

const Dashboard = () => {
  const { user } = useAuthContext();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 2000);
    return () => clearInterval(id);
  }, []);

  const maxTraffic = Math.max(...TRAFFIC);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Command Dashboard</h1>
          <p className={styles.pageSubtitle}>Welcome back, <span className={styles.highlight}>{user?.name || 'Admin'}</span> — Network is operational</p>
        </div>
        <div className={styles.statusPill}>
          <span className={styles.statusDot} />
          All Systems Nominal
        </div>
      </div>

      <div className={styles.statsGrid}>
        {STATS.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      <div className={styles.bottomGrid}>
        <div className={styles.glassCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Traffic Overview</span>
            <span className={styles.cardBadge}>Last 12h</span>
          </div>
          <div className={styles.barChart}>
            {TRAFFIC.map((v, i) => (
              <div key={i} className={styles.barWrap}>
                <div
                  className={styles.bar}
                  style={{ height: `${(v / maxTraffic) * 100}%`, opacity: i === tick % 12 ? 1 : 0.55 }}
                />
              </div>
            ))}
          </div>
          <div className={styles.barLabels}>
            {['12a','2a','4a','6a','8a','10a','12p','2p','4p','6p','8p','10p'].map(l => (
              <span key={l} className={styles.barLabel}>{l}</span>
            ))}
          </div>
        </div>

        <div className={styles.glassCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Live Activity</span>
            <span className={`${styles.cardBadge} ${styles.live}`}>● LIVE</span>
          </div>
          <div className={styles.activityList}>
            {ACTIVITY.map((a, i) => (
              <div key={i} className={styles.activityItem}>
                <span className={`${styles.activityDot} ${styles[a.type]}`} />
                <div className={styles.activityContent}>
                  <span className={styles.activityMsg}>{a.msg}</span>
                  <span className={styles.activityTime}>{a.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.glassCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Network Health</span>
          </div>
          <div className={styles.healthList}>
            {[
              { label: 'Core Switch', pct: 92 },
              { label: 'Wireless APs', pct: 87 },
              { label: 'Firewall', pct: 99 },
              { label: 'WAN Link', pct: 74 },
            ].map(({ label, pct }) => (
              <div key={label} className={styles.healthRow}>
                <span className={styles.healthLabel}>{label}</span>
                <div className={styles.healthBar}>
                  <div
                    className={styles.healthFill}
                    style={{ width: `${pct}%`, background: pct > 90 ? 'var(--success)' : pct > 75 ? 'var(--accent-blue)' : 'var(--accent-orange)' }}
                  />
                </div>
                <span className={styles.healthPct}>{pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
