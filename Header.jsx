import React, { useState, useEffect } from 'react';

export default function Header() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeStr = time.toLocaleTimeString('en-US', { hour12: false });
  const dateStr = time.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase();

  return (
    <header style={styles.header}>
      <div style={styles.topBar}>
        <div style={styles.sysInfo}>
          <span style={styles.sysLabel}>SYS</span>
          <span style={styles.dot}></span>
          <span style={styles.sysText}>PLAYERSIGNAL v1.0</span>
        </div>
        <div style={styles.clock}>
          <span style={styles.clockTime}>{timeStr}</span>
          <span style={styles.clockDate}>{dateStr}</span>
        </div>
      </div>

      <div style={styles.titleRow}>
        <div style={styles.logoGroup}>
          <RadarIcon />
          <div>
            <h1 style={styles.title}>PLAYER<span style={styles.titleAccent}>SIGNAL</span></h1>
            <p style={styles.subtitle}>PLATFORMA ANALIZY NASTROJÓW GRACZY</p>
          </div>
        </div>
        <div style={styles.statusGroup}>
          <StatusBadge label="RAWG API" status="ONLINE" />
          <StatusBadge label="SILNIK ANALIZY" status="AKTYWNY" />
        </div>
      </div>

      <div style={styles.divider}>
        <div style={styles.dividerLine}></div>
        <span style={styles.dividerText}>◆ NARZĘDZIE DLA REDAKTORÓW GAMINGOWYCH ◆</span>
        <div style={styles.dividerLine}></div>
      </div>
    </header>
  );
}

function RadarIcon() {
  return (
    <div style={styles.radar}>
      <div style={styles.radarRing1}></div>
      <div style={styles.radarRing2}></div>
      <div style={styles.radarDot}></div>
      <div style={styles.radarSweep}></div>
    </div>
  );
}

function StatusBadge({ label, status }) {
  return (
    <div style={styles.badge}>
      <div style={styles.badgeDot}></div>
      <span style={styles.badgeLabel}>{label}</span>
      <span style={styles.badgeStatus}>{status}</span>
    </div>
  );
}

const styles = {
  header: {
    borderBottom: '1px solid #1e3028',
    paddingBottom: '0',
    background: 'linear-gradient(180deg, #0a1410 0%, #060908 100%)',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 32px',
    borderBottom: '1px solid #0f1f18',
    background: '#080d0b',
  },
  sysInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  sysLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    color: '#3d5c4a',
    letterSpacing: '2px',
  },
  dot: {
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    background: '#00ff88',
    animation: 'pulse-dot 2s infinite',
  },
  sysText: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    color: '#3d5c4a',
    letterSpacing: '1px',
  },
  clock: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  clockTime: {
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    color: '#00ff88',
    letterSpacing: '2px',
  },
  clockDate: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    color: '#3d5c4a',
    letterSpacing: '1px',
  },
  titleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 32px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  logoGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(28px, 5vw, 48px)',
    fontWeight: 900,
    letterSpacing: '6px',
    lineHeight: 1,
    color: '#e8f5ee',
  },
  titleAccent: {
    color: '#00ff88',
    textShadow: '0 0 20px rgba(0,255,136,0.5)',
  },
  subtitle: {
    fontFamily: 'var(--font-mono)',
    fontSize: '9px',
    color: '#3d5c4a',
    letterSpacing: '3px',
    marginTop: '4px',
  },
  statusGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    alignItems: 'flex-end',
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#0c1210',
    border: '1px solid #1e3028',
    padding: '4px 10px',
    borderRadius: '2px',
  },
  badgeDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#00ff88',
    boxShadow: '0 0 6px #00ff88',
    animation: 'pulse-dot 2s infinite',
  },
  badgeLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '9px',
    color: '#7da890',
    letterSpacing: '1px',
  },
  badgeStatus: {
    fontFamily: 'var(--font-mono)',
    fontSize: '9px',
    color: '#00ff88',
    letterSpacing: '1px',
  },
  radar: {
    position: 'relative',
    width: '52px',
    height: '52px',
    flexShrink: 0,
  },
  radarRing1: {
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    border: '1px solid #1e3028',
  },
  radarRing2: {
    position: 'absolute',
    inset: '8px',
    borderRadius: '50%',
    border: '1px solid #2a4838',
  },
  radarDot: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#00ff88',
    boxShadow: '0 0 8px #00ff88',
  },
  radarSweep: {
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    background: 'conic-gradient(from 0deg, rgba(0,255,136,0.3) 0deg, transparent 60deg)',
    animation: 'radar-sweep 3s linear infinite',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '0 32px',
    marginBottom: '0',
    paddingBottom: '16px',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, #1e3028)',
  },
  dividerText: {
    fontFamily: 'var(--font-mono)',
    fontSize: '9px',
    color: '#2a4838',
    letterSpacing: '3px',
    whiteSpace: 'nowrap',
  },
};
