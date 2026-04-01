import React, { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import styles from './Settings.module.css';

const TABS = ['Profile', 'Security', 'Notifications', 'System'];

const Toggle = ({ checked, onChange }) => (
  <button
    className={`${styles.toggle} ${checked ? styles.toggleOn : ''}`}
    onClick={() => onChange(!checked)}
    type="button"
  >
    <span className={styles.toggleThumb} />
  </button>
);

const Settings = () => {
  const { user } = useAuthContext();
  const [tab, setTab] = useState('Profile');
  const [saved, setSaved] = useState(false);
  const [notifs, setNotifs] = useState({ alerts: true, firmware: true, rogue: false, reports: true });
  const [twofa, setTwofa] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30');

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Settings</h1>
        <p className={styles.pageSubtitle}>Manage your account and system preferences</p>
      </div>

      <div className={styles.layout}>
        <div className={styles.tabList}>
          {TABS.map(t => (
            <button
              key={t}
              className={`${styles.tabItem} ${tab === t ? styles.tabActive : ''}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div className={styles.content}>
          {tab === 'Profile' && (
            <div className={styles.section}>
              <div className={styles.avatarSection}>
                <div className={styles.bigAvatar}>
                  {user?.name?.[0]?.toUpperCase() || 'A'}
                </div>
                <div>
                  <div className={styles.avatarName}>{user?.name || 'Admin User'}</div>
                  <div className={styles.avatarRole}>Network Administrator</div>
                  <button className={styles.changeAvatarBtn}>Change Photo</button>
                </div>
              </div>
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label className={styles.label}>Full Name</label>
                  <input className={styles.input} defaultValue={user?.name || ''} placeholder="Your full name" />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Email Address</label>
                  <input className={styles.input} defaultValue={user?.email || ''} placeholder="you@example.com" />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Phone</label>
                  <input className={styles.input} placeholder="+1 (555) 000-0000" />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Role</label>
                  <input className={styles.input} defaultValue="Network Administrator" readOnly />
                </div>
              </div>
            </div>
          )}

          {tab === 'Security' && (
            <div className={styles.section}>
              <div className={styles.settingRow}>
                <div>
                  <div className={styles.settingLabel}>Two-Factor Authentication</div>
                  <div className={styles.settingDesc}>Add an extra layer of security to your account</div>
                </div>
                <Toggle checked={twofa} onChange={setTwofa} />
              </div>
              <div className={styles.divider} />
              <div className={styles.field}>
                <label className={styles.label}>Session Timeout (minutes)</label>
                <select className={styles.input} value={sessionTimeout} onChange={e => setSessionTimeout(e.target.value)}>
                  {['15','30','60','120'].map(v => <option key={v} value={v}>{v} min</option>)}
                </select>
              </div>
              <div className={styles.divider} />
              <div className={styles.field}>
                <label className={styles.label}>Current Password</label>
                <input className={styles.input} type="password" placeholder="••••••••" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>New Password</label>
                <input className={styles.input} type="password" placeholder="Min. 8 characters" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Confirm New Password</label>
                <input className={styles.input} type="password" placeholder="Repeat new password" />
              </div>
            </div>
          )}

          {tab === 'Notifications' && (
            <div className={styles.section}>
              {[
                { key: 'alerts', label: 'Critical Alerts', desc: 'Notify on device failures and outages' },
                { key: 'firmware', label: 'Firmware Updates', desc: 'Notify when new firmware is available' },
                { key: 'rogue', label: 'Rogue Device Detection', desc: 'Alert on unauthorized devices' },
                { key: 'reports', label: 'Weekly Reports', desc: 'Receive weekly network summary' },
              ].map(({ key, label, desc }) => (
                <React.Fragment key={key}>
                  <div className={styles.settingRow}>
                    <div>
                      <div className={styles.settingLabel}>{label}</div>
                      <div className={styles.settingDesc}>{desc}</div>
                    </div>
                    <Toggle checked={notifs[key]} onChange={v => setNotifs(n => ({ ...n, [key]: v }))} />
                  </div>
                  <div className={styles.divider} />
                </React.Fragment>
              ))}
            </div>
          )}

          {tab === 'System' && (
            <div className={styles.section}>
              {[
                { label: 'Software Version', value: 'ArubaOS 10.4.2' },
                { label: 'License Type', value: 'Enterprise' },
                { label: 'License Expiry', value: 'Dec 31, 2025' },
                { label: 'Last Backup', value: 'Today, 03:00 AM' },
                { label: 'API Endpoint', value: 'https://api.aruba.local' },
              ].map(({ label, value }) => (
                <div key={label} className={styles.infoRow}>
                  <span className={styles.infoLabel}>{label}</span>
                  <span className={styles.infoValue}>{value}</span>
                </div>
              ))}
              <div className={styles.divider} />
              <div className={styles.dangerZone}>
                <div className={styles.dangerTitle}>Danger Zone</div>
                <button className={styles.dangerBtn}>Factory Reset</button>
                <button className={styles.dangerBtn}>Revoke All Sessions</button>
              </div>
            </div>
          )}

          <div className={styles.footer}>
            {saved && <span className={styles.savedMsg}>✓ Changes saved successfully</span>}
            <button className={styles.saveBtn} onClick={handleSave}>Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
