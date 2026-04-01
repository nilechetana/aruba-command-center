import React, { useState } from 'react';
import styles from './NetworkMap.module.css';

const NODES = [
  { id: 'core', label: 'Core Switch', type: 'switch', x: 50, y: 45, status: 'online' },
  { id: 'fw', label: 'Firewall', type: 'firewall', x: 50, y: 15, status: 'online' },
  { id: 'wan', label: 'WAN Router', type: 'router', x: 50, y: 78, status: 'online' },
  { id: 'ap1', label: 'AP-Floor1', type: 'ap', x: 18, y: 30, status: 'online' },
  { id: 'ap2', label: 'AP-Floor2', type: 'ap', x: 82, y: 30, status: 'online' },
  { id: 'ap3', label: 'AP-Floor3', type: 'ap', x: 18, y: 62, status: 'warn' },
  { id: 'ap4', label: 'AP-Lobby', type: 'ap', x: 82, y: 62, status: 'online' },
  { id: 'sw1', label: 'SW-Floor1', type: 'switch', x: 18, y: 45, status: 'online' },
  { id: 'sw2', label: 'SW-Floor2', type: 'switch', x: 82, y: 45, status: 'offline' },
];

const LINKS = [
  ['fw', 'core'], ['core', 'wan'], ['core', 'sw1'], ['core', 'sw2'],
  ['sw1', 'ap1'], ['sw1', 'ap3'], ['sw2', 'ap2'], ['sw2', 'ap4'],
];

const TYPE_ICONS = { switch: '⬡', firewall: '◈', router: '◎', ap: '▣' };
const STATUS_COLOR = { online: 'var(--success)', warn: 'var(--accent-orange)', offline: 'var(--error)' };

const NetworkMap = () => {
  const [selected, setSelected] = useState(null);
  const node = selected ? NODES.find(n => n.id === selected) : null;

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Network Map</h1>
          <p className={styles.pageSubtitle}>Live topology — click a node to inspect</p>
        </div>
        <div className={styles.legend}>
          {Object.entries(STATUS_COLOR).map(([s, c]) => (
            <span key={s} className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: c }} />
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.mapArea}>
        <div className={styles.mapCanvas}>
          <svg className={styles.svg} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            {LINKS.map(([a, b]) => {
              const na = NODES.find(n => n.id === a);
              const nb = NODES.find(n => n.id === b);
              const active = selected === a || selected === b;
              return (
                <line
                  key={`${a}-${b}`}
                  x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                  stroke={active ? 'rgba(0,194,255,0.7)' : 'rgba(0,194,255,0.18)'}
                  strokeWidth={active ? 0.5 : 0.3}
                  strokeDasharray={active ? 'none' : '1 1'}
                />
              );
            })}
          </svg>

          {NODES.map(n => (
            <button
              key={n.id}
              className={`${styles.node} ${selected === n.id ? styles.nodeSelected : ''}`}
              style={{ left: `${n.x}%`, top: `${n.y}%` }}
              onClick={() => setSelected(selected === n.id ? null : n.id)}
            >
              <span className={styles.nodeIcon} style={{ color: STATUS_COLOR[n.status] }}>
                {TYPE_ICONS[n.type]}
              </span>
              <span className={styles.nodeLabel}>{n.label}</span>
              <span className={styles.nodePulse} style={{ background: STATUS_COLOR[n.status] }} />
            </button>
          ))}
        </div>

        {node && (
          <div className={styles.inspector}>
            <div className={styles.inspectorHeader}>
              <span className={styles.inspectorIcon}>{TYPE_ICONS[node.type]}</span>
              <div>
                <div className={styles.inspectorName}>{node.label}</div>
                <div className={styles.inspectorType}>{node.type.toUpperCase()}</div>
              </div>
              <button className={styles.closeBtn} onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className={styles.inspectorBody}>
              <div className={styles.infoRow}>
                <span>Status</span>
                <span style={{ color: STATUS_COLOR[node.status], fontWeight: 600 }}>
                  {node.status.toUpperCase()}
                </span>
              </div>
              <div className={styles.infoRow}><span>IP Address</span><span>10.0.{NODES.indexOf(node)}.1</span></div>
              <div className={styles.infoRow}><span>MAC</span><span>AA:BB:{NODES.indexOf(node).toString().padStart(2,'0')}:CC:DD:EE</span></div>
              <div className={styles.infoRow}><span>Uptime</span><span>{Math.floor(Math.random()*30 + 1)}d {Math.floor(Math.random()*24)}h</span></div>
              <div className={styles.infoRow}><span>Connections</span><span>{LINKS.filter(([a,b]) => a === node.id || b === node.id).length}</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NetworkMap;
