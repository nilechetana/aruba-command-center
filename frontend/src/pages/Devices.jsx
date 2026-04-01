import React, { useState } from 'react';
import styles from './Devices.module.css';

const DEVICES = [
  { id: 1, name: 'AP-Core-01', type: 'Access Point', ip: '10.0.1.10', mac: 'AA:BB:01:CC:DD:EE', status: 'online', signal: 92, vlan: 10 },
  { id: 2, name: 'SW-Floor1', type: 'Switch', ip: '10.0.1.20', mac: 'AA:BB:02:CC:DD:EE', status: 'online', signal: 100, vlan: 20 },
  { id: 3, name: 'AP-Floor2', type: 'Access Point', ip: '10.0.1.30', mac: 'AA:BB:03:CC:DD:EE', status: 'online', signal: 78, vlan: 10 },
  { id: 4, name: 'SW-Floor3', type: 'Switch', ip: '10.0.1.40', mac: 'AA:BB:04:CC:DD:EE', status: 'warn', signal: 55, vlan: 30 },
  { id: 5, name: 'FW-Edge', type: 'Firewall', ip: '10.0.0.1', mac: 'AA:BB:05:CC:DD:EE', status: 'online', signal: 100, vlan: 1 },
  { id: 6, name: 'AP-Lobby', type: 'Access Point', ip: '10.0.1.50', mac: 'AA:BB:06:CC:DD:EE', status: 'offline', signal: 0, vlan: 40 },
  { id: 7, name: 'Router-WAN', type: 'Router', ip: '192.168.1.1', mac: 'AA:BB:07:CC:DD:EE', status: 'online', signal: 100, vlan: 1 },
  { id: 8, name: 'AP-Conf-Room', type: 'Access Point', ip: '10.0.1.60', mac: 'AA:BB:08:CC:DD:EE', status: 'online', signal: 85, vlan: 10 },
];

const STATUS_COLORS = { online: 'var(--success)', warn: 'var(--accent-orange)', offline: 'var(--error)' };

const Devices = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const filtered = DEVICES.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.ip.includes(search) || d.type.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || d.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Devices</h1>
          <p className={styles.pageSubtitle}>{DEVICES.length} total devices · {DEVICES.filter(d => d.status === 'online').length} online</p>
        </div>
        <button className={styles.addBtn}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Device
        </button>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <svg className={styles.searchIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className={styles.searchInput}
            placeholder="Search by name, IP, or type…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.filters}>
          {['all', 'online', 'warn', 'offline'].map(f => (
            <button
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Device</th>
              <th>Type</th>
              <th>IP Address</th>
              <th>VLAN</th>
              <th>Signal</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(d => (
              <tr
                key={d.id}
                className={`${styles.row} ${selected === d.id ? styles.rowSelected : ''}`}
                onClick={() => setSelected(selected === d.id ? null : d.id)}
              >
                <td>
                  <div className={styles.deviceName}>
                    <span className={styles.deviceDot} style={{ background: STATUS_COLORS[d.status] }} />
                    {d.name}
                  </div>
                </td>
                <td><span className={styles.typeBadge}>{d.type}</span></td>
                <td className={styles.mono}>{d.ip}</td>
                <td><span className={styles.vlanBadge}>VLAN {d.vlan}</span></td>
                <td>
                  <div className={styles.signalWrap}>
                    <div className={styles.signalBar}>
                      <div
                        className={styles.signalFill}
                        style={{
                          width: `${d.signal}%`,
                          background: d.signal > 80 ? 'var(--success)' : d.signal > 50 ? 'var(--accent-blue)' : 'var(--error)'
                        }}
                      />
                    </div>
                    <span className={styles.signalPct}>{d.signal}%</span>
                  </div>
                </td>
                <td>
                  <span className={styles.statusBadge} style={{ color: STATUS_COLORS[d.status], borderColor: STATUS_COLORS[d.status] + '44', background: STATUS_COLORS[d.status] + '11' }}>
                    {d.status}
                  </span>
                </td>
                <td>
                  <button className={styles.actionBtn} onClick={e => e.stopPropagation()}>⋯</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className={styles.empty}>No devices match your search</div>
        )}
      </div>
    </div>
  );
};

export default Devices;
