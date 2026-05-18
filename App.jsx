import React, { useState } from 'react';
import Header from './components/Header.jsx';
import SearchBar from './components/SearchBar.jsx';
import GameCard from './components/GameCard.jsx';
import SentimentReport from './components/SentimentReport.jsx';
import { searchGames, getGameDetails, getGameReviews } from './rawg.js';
import { aggregateSentiments } from './sentiment.js';

export default function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [sentimentData, setSentimentData] = useState(null);
  const [searching, setSearching] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query) => {
    setSearching(true);
    setError(null);
    setSearchResults([]);
    setSelectedGame(null);
    setReviews([]);
    setSentimentData(null);
    setHasSearched(true);

    try {
      const results = await searchGames(query);
      setSearchResults(results);
      if (results.length === 0) {
        setError('Nie znaleziono gier. Spróbuj innego tytułu.');
      }
    } catch (e) {
      setError('Błąd połączenia z bazą gier. Sprawdź internet.');
      console.error(e);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectGame = async (game) => {
    if (selectedGame?.id === game.id) return;
    setSelectedGame(game);
    setAnalyzing(true);
    setReviews([]);
    setSentimentData(null);
    setError(null);

    try {
      const [details, gameReviews] = await Promise.all([
        getGameDetails(game.id),
        getGameReviews(game.id),
      ]);

      // Merge details into game
      setSelectedGame(details);
      setReviews(gameReviews);

      if (gameReviews.length > 0) {
        const agg = aggregateSentiments(gameReviews);
        setSentimentData(agg);
      } else {
        setSentimentData(null);
      }
    } catch (e) {
      setError('Błąd ładowania danych. Spróbuj ponownie.');
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div style={styles.app}>
      <Header />
      <SearchBar onSearch={handleSearch} loading={searching} />

      <div style={styles.body}>
        {/* Left panel: search results */}
        <aside style={styles.aside}>
          {searching && (
            <div style={styles.scanMsg}>
              <span style={styles.scanDot}></span>
              <span style={styles.scanText}>SKANOWANIE BAZY DANYCH...</span>
            </div>
          )}
          {!searching && hasSearched && searchResults.length === 0 && !error && (
            <div style={styles.emptyMsg}>
              <span style={styles.emptyText}>BRAK WYNIKÓW</span>
            </div>
          )}
          {error && !searching && (
            <div style={styles.errorMsg}>
              <span style={styles.errorIcon}>⚠</span>
              <span style={styles.errorText}>{error}</span>
            </div>
          )}
          {!hasSearched && (
            <div style={styles.welcomePanel}>
              <div style={styles.welcomeIcon}>◈</div>
              <div style={styles.welcomeTitle}>GOTOWY DO ANALIZY</div>
              <div style={styles.welcomeText}>
                Wyszukaj dowolną grę, aby uruchomić skanowanie nastrojów społeczności.
                Zaprojektowany dla dziennikarzy i redaktorów gamingowych.
              </div>
              <div style={styles.welcomeFeatures}>
                <Feature icon="◆" text="Wynik sentymentu (0–100)" />
                <Feature icon="◆" text="Wykrywanie sygnałów pozy./neg." />
                <Feature icon="◆" text="Szczegółowy podgląd recenzji" />
                <Feature icon="◆" text="Analiza rozkładu nastrojów" />
              </div>
            </div>
          )}
          <div style={styles.resultsList}>
            {searchResults.map((game, i) => (
              <div key={game.id} style={{ animationDelay: `${i * 0.05}s` }}>
                <GameCard
                  game={game}
                  onSelect={handleSelectGame}
                  selected={selectedGame?.id === game.id}
                />
              </div>
            ))}
          </div>
        </aside>

        {/* Right panel: analysis */}
        <main style={styles.main}>
          {!selectedGame && !analyzing && (
            <div style={styles.mainPlaceholder}>
              <div style={styles.placeholderGrid}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} style={{
                    ...styles.placeholderCell,
                    animationDelay: `${i * 0.2}s`,
                    opacity: 0.3 - i * 0.04,
                  }}></div>
                ))}
              </div>
              <div style={styles.placeholderMsg}>
                <span style={styles.placeholderIcon}>⬡</span>
                <span style={styles.placeholderText}>
                  {hasSearched ? 'WYBIERZ GRĘ DO ANALIZY' : 'OCZEKIWANIE NA WYSZUKIWANIE'}
                </span>
              </div>
            </div>
          )}
          {(selectedGame || analyzing) && (
            <SentimentReport
              game={selectedGame}
              reviews={reviews}
              sentimentData={sentimentData}
              loading={analyzing}
            />
          )}
        </main>
      </div>
    </div>
  );
}

function Feature({ icon, text }) {
  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <span style={{ color: '#00ff88', fontSize: '8px' }}>{icon}</span>
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        color: '#7da890',
        letterSpacing: '0.5px',
      }}>{text}</span>
    </div>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  body: {
    display: 'flex',
    flex: 1,
    gap: '0',
  },
  aside: {
    width: '280px',
    flexShrink: 0,
    borderRight: '1px solid #1e3028',
    background: '#080d0b',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    maxHeight: 'calc(100vh - 160px)',
    position: 'sticky',
    top: 0,
  },
  main: {
    flex: 1,
    overflowY: 'auto',
    minWidth: 0,
  },
  resultsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '12px',
  },
  scanMsg: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '16px 12px',
    borderBottom: '1px solid #1e3028',
  },
  scanDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#00ff88',
    animation: 'pulse-dot 0.8s infinite',
    flexShrink: 0,
  },
  scanText: {
    fontFamily: 'var(--font-mono)',
    fontSize: '9px',
    color: '#00ff88',
    letterSpacing: '2px',
    animation: 'flicker 2s infinite',
  },
  emptyMsg: {
    padding: '24px 12px',
    textAlign: 'center',
  },
  emptyText: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    color: '#3d5c4a',
    letterSpacing: '2px',
  },
  errorMsg: {
    display: 'flex',
    gap: '8px',
    padding: '16px 12px',
    background: '#1a0a0f',
    border: '1px solid #3d0f1a',
    margin: '8px',
    borderRadius: '2px',
  },
  errorIcon: {
    color: '#ff4466',
    fontSize: '12px',
    flexShrink: 0,
  },
  errorText: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    color: '#ff4466',
    letterSpacing: '0.5px',
    lineHeight: 1.5,
  },
  welcomePanel: {
    padding: '24px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    borderBottom: '1px solid #1e3028',
  },
  welcomeIcon: {
    fontSize: '24px',
    color: '#2a4838',
  },
  welcomeTitle: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    color: '#00ff88',
    letterSpacing: '2px',
  },
  welcomeText: {
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    color: '#3d5c4a',
    lineHeight: 1.6,
  },
  welcomeFeatures: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginTop: '4px',
  },
  mainPlaceholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: '32px',
    padding: '48px',
    position: 'relative',
    overflow: 'hidden',
  },
  placeholderGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 60px)',
    gridTemplateRows: 'repeat(2, 60px)',
    gap: '8px',
  },
  placeholderCell: {
    background: '#0c1210',
    border: '1px solid #1e3028',
    borderRadius: '2px',
    animation: 'pulse-dot 2s infinite',
  },
  placeholderMsg: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  placeholderIcon: {
    fontSize: '32px',
    color: '#1e3028',
  },
  placeholderText: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: '#2a4838',
    letterSpacing: '3px',
  },
};
