import React, { useState, useRef } from 'react';

export default function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !loading) {
      onSearch(query.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit(e);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.label}>
        <span style={styles.labelIcon}>◈</span>
        <span style={styles.labelText}>WYSZUKIWANIE GRY — Wpisz tytuł, aby rozpocząć analizę sentymentu</span>
      </div>
      <div style={styles.inputRow}>
        <div style={styles.inputWrap}>
          <div style={styles.inputPrefix}>SEARCH://</div>
          <input
            ref={inputRef}
            style={styles.input}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="np. Elden Ring, Cyberpunk 2077, Wiedźmin 3..."
            disabled={loading}
            autoComplete="off"
            spellCheck={false}
          />
          <div style={styles.cursor}></div>
        </div>
        <button
          style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
          onClick={handleSubmit}
          disabled={loading || !query.trim()}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#00c86a'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#00ff88'; }}
        >
          {loading ? (
            <span style={styles.loadingSpinner}></span>
          ) : (
            <>
              <span style={styles.btnIcon}>⬡</span>
              ANALIZUJ
            </>
          )}
        </button>
      </div>
      <div style={styles.hints}>
        {['Elden Ring', 'Cyberpunk 2077', 'Hollow Knight', 'Baldur\'s Gate 3'].map(hint => (
          <button
            key={hint}
            style={styles.hint}
            onClick={() => { setQuery(hint); onSearch(hint); }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#00ff88'; e.currentTarget.style.color = '#00ff88'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e3028'; e.currentTarget.style.color = '#7da890'; }}
          >
            {hint}
          </button>
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    padding: '24px 32px',
    borderBottom: '1px solid #1e3028',
    background: '#080d0b',
    animation: 'fade-in-up 0.4s ease both',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
  },
  labelIcon: {
    color: '#00ff88',
    fontSize: '12px',
  },
  labelText: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    color: '#3d5c4a',
    letterSpacing: '2px',
  },
  inputRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'stretch',
  },
  inputWrap: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    background: '#0c1210',
    border: '1px solid #2a4838',
    borderRadius: '2px',
    padding: '0 16px',
    gap: '10px',
    transition: 'border-color 0.2s',
    minHeight: '48px',
  },
  inputPrefix: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: '#00ff88',
    letterSpacing: '1px',
    whiteSpace: 'nowrap',
    userSelect: 'none',
  },
  input: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#e8f5ee',
    fontFamily: 'var(--font-mono)',
    fontSize: '14px',
    letterSpacing: '1px',
  },
  cursor: {
    width: '2px',
    height: '18px',
    background: '#00ff88',
    animation: 'pulse-dot 1s infinite',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#00ff88',
    color: '#060908',
    border: 'none',
    borderRadius: '2px',
    padding: '0 24px',
    fontFamily: 'var(--font-display)',
    fontSize: '14px',
    fontWeight: 700,
    letterSpacing: '3px',
    cursor: 'pointer',
    transition: 'background 0.15s',
    whiteSpace: 'nowrap',
    minHeight: '48px',
  },
  buttonDisabled: {
    background: '#0d3d24',
    color: '#3d5c4a',
    cursor: 'not-allowed',
  },
  btnIcon: {
    fontSize: '12px',
  },
  loadingSpinner: {
    display: 'inline-block',
    width: '16px',
    height: '16px',
    border: '2px solid #0d3d24',
    borderTopColor: '#00ff88',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
  hints: {
    display: 'flex',
    gap: '8px',
    marginTop: '10px',
    flexWrap: 'wrap',
  },
  hint: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    color: '#7da890',
    background: 'transparent',
    border: '1px solid #1e3028',
    borderRadius: '2px',
    padding: '3px 10px',
    cursor: 'pointer',
    letterSpacing: '1px',
    transition: 'all 0.15s',
  },
};
