import React from 'react';
import { formatDate, getPlatformIcons } from '../rawg.js';

export default function GameCard({ game, onSelect, selected }) {
  const icons = getPlatformIcons(game.platforms);
  const ratingPct = ((game.rating || 0) / 5) * 100;

  return (
    <div
      style={{
        ...styles.card,
        ...(selected ? styles.cardSelected : {}),
      }}
      onClick={() => onSelect(game)}
      onMouseEnter={e => {
        if (!selected) {
          e.currentTarget.style.borderColor = '#2a4838';
          e.currentTarget.style.background = '#111916';
        }
      }}
      onMouseLeave={e => {
        if (!selected) {
          e.currentTarget.style.borderColor = '#1e3028';
          e.currentTarget.style.background = '#0c1210';
        }
      }}
    >
      <div style={styles.imageWrap}>
        {game.background_image ? (
          <img src={game.background_image} alt={game.name} style={styles.image} />
        ) : (
          <div style={styles.noImage}>
            <span style={styles.noImageText}>NO IMG</span>
          </div>
        )}
        {selected && <div style={styles.selectedOverlay}><span style={styles.selectedMark}>◆ SELECTED</span></div>}
      </div>
      <div style={styles.info}>
        <div style={styles.name}>{game.name}</div>
        <div style={styles.meta}>
          <span style={styles.year}>{game.released ? game.released.slice(0, 4) : 'TBA'}</span>
          {icons.length > 0 && (
            <span style={styles.platforms}>{icons.join(' ')}</span>
          )}
        </div>
        <div style={styles.ratingRow}>
          <div style={styles.ratingBar}>
            <div style={{ ...styles.ratingFill, width: `${ratingPct}%` }}></div>
          </div>
          <span style={styles.ratingNum}>{game.rating ? game.rating.toFixed(1) : '—'}</span>
        </div>
        {game.genres && game.genres.length > 0 && (
          <div style={styles.genres}>
            {game.genres.slice(0, 2).map(g => (
              <span key={g.id} style={styles.genre}>{g.name}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: '#0c1210',
    border: '1px solid #1e3028',
    borderRadius: '2px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.15s',
    animation: 'fade-in-up 0.3s ease both',
  },
  cardSelected: {
    borderColor: '#00ff88',
    background: '#0d1f15',
    boxShadow: '0 0 16px rgba(0,255,136,0.1)',
  },
  imageWrap: {
    position: 'relative',
    height: '80px',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'brightness(0.7) saturate(0.8)',
  },
  noImage: {
    width: '100%',
    height: '100%',
    background: '#111916',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImageText: {
    fontFamily: 'var(--font-mono)',
    fontSize: '9px',
    color: '#3d5c4a',
    letterSpacing: '2px',
  },
  selectedOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,255,136,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedMark: {
    fontFamily: 'var(--font-mono)',
    fontSize: '9px',
    color: '#00ff88',
    letterSpacing: '2px',
    textShadow: '0 0 8px #00ff88',
  },
  info: {
    padding: '10px',
  },
  name: {
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: '13px',
    color: '#e8f5ee',
    lineHeight: 1.2,
    marginBottom: '4px',
    letterSpacing: '0.5px',
  },
  meta: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    marginBottom: '6px',
  },
  year: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    color: '#3d5c4a',
  },
  platforms: {
    fontSize: '10px',
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '6px',
  },
  ratingBar: {
    flex: 1,
    height: '3px',
    background: '#1e3028',
    borderRadius: '1px',
    overflow: 'hidden',
  },
  ratingFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #00c86a, #00ff88)',
    transition: 'width 0.5s ease',
  },
  ratingNum: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    color: '#7da890',
  },
  genres: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap',
  },
  genre: {
    fontFamily: 'var(--font-mono)',
    fontSize: '8px',
    color: '#3d5c4a',
    background: '#0a1410',
    border: '1px solid #1e3028',
    padding: '1px 5px',
    borderRadius: '1px',
    letterSpacing: '1px',
  },
};
