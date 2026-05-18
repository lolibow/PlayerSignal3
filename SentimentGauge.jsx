import React, { useEffect, useState } from 'react';
import { getSentimentColor, getSentimentGlow } from '../sentiment.js';

export default function SentimentGauge({ score, label, size = 160 }) {
  const [animScore, setAnimScore] = useState(0);

  useEffect(() => {
    setAnimScore(0);
    const timer = setTimeout(() => setAnimScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const color = getSentimentColor(score);
  const glow = getSentimentGlow(score);
  const radius = size / 2 - 16;
  const circumference = 2 * Math.PI * radius;
  // Use 75% of circumference for the arc (270 degrees)
  const arcLength = circumference * 0.75;
  const offset = arcLength - (animScore / 100) * arcLength;

  return (
    <div style={{ ...styles.wrapper, width: size, height: size }}>
      <svg width={size} height={size} style={styles.svg}>
        {/* Background arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1e3028"
          strokeWidth="8"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset="0"
          strokeLinecap="round"
          transform={`rotate(135 ${size / 2} ${size / 2})`}
        />
        {/* Value arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(135 ${size / 2} ${size / 2})`}
          style={{
            transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)',
            filter: `drop-shadow(0 0 6px ${color})`,
          }}
        />
        {/* Tick marks */}
        {[0, 25, 50, 75, 100].map((tick, i) => {
          const angle = (135 + (tick / 100) * 270) * (Math.PI / 180);
          const innerR = radius - 10;
          const outerR = radius - 4;
          return (
            <line
              key={i}
              x1={size / 2 + innerR * Math.cos(angle)}
              y1={size / 2 + innerR * Math.sin(angle)}
              x2={size / 2 + outerR * Math.cos(angle)}
              y2={size / 2 + outerR * Math.sin(angle)}
              stroke="#2a4838"
              strokeWidth="2"
            />
          );
        })}
      </svg>

      <div style={styles.center}>
        <div style={{ ...styles.score, color, textShadow: `0 0 20px ${color}` }}>
          {Math.round(animScore)}
        </div>
        <div style={{ ...styles.label, color }}>
          {label}
        </div>
      </div>

      {/* Glow backdrop */}
      <div style={{
        position: 'absolute',
        inset: '20%',
        borderRadius: '50%',
        background: glow,
        filter: 'blur(20px)',
        pointerEvents: 'none',
        transition: 'background 1s',
      }}></div>
    </div>
  );
}

const styles = {
  wrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  svg: {
    position: 'absolute',
    inset: 0,
    zIndex: 1,
  },
  center: {
    position: 'relative',
    zIndex: 2,
    textAlign: 'center',
    marginTop: '8px',
  },
  score: {
    fontFamily: 'var(--font-display)',
    fontWeight: 900,
    fontSize: '42px',
    lineHeight: 1,
    letterSpacing: '-2px',
    transition: 'color 1s',
  },
  label: {
    fontFamily: 'var(--font-mono)',
    fontSize: '8px',
    letterSpacing: '2px',
    marginTop: '2px',
    transition: 'color 1s',
  },
};
