import React, { useState } from 'react';
import SentimentGauge from './SentimentGauge.jsx';
import { getSentimentColor } from '../sentiment.js';
import { formatDate, getPlatformIcons } from '../rawg.js';

export default function SentimentReport({ game, reviews, sentimentData, loading }) {
  if (loading) return <LoadingPanel />;
  if (!game) return null;
  if (!sentimentData) return <NoData game={game} />;

  const icons = getPlatformIcons(game.platforms);
  const color = getSentimentColor(sentimentData.avgScore);

  return (
    <div style={styles.report}>
      {/* Game Header */}
      <div style={styles.gameHeader}>
        <div style={styles.gameImageWrap}>
          {game.background_image && (
            <img src={game.background_image} alt={game.name} style={styles.gameImage} />
          )}
          <div style={styles.gameImageOverlay}></div>
        </div>
        <div style={styles.gameInfo}>
          <div style={styles.gameMetaTop}>
            <span style={styles.gameTag}>◈ WYBRANA GRA</span>
            <span style={styles.gameDate}>{formatDate(game.released)}</span>
          </div>
          <h2 style={styles.gameName}>{game.name}</h2>
          <div style={styles.gameTags}>
            {icons.map((icon, i) => <span key={i} style={styles.platform}>{icon}</span>)}
            {game.genres?.slice(0, 3).map(g => (
              <span key={g.id} style={styles.genreTag}>{g.name}</span>
            ))}
            {game.esrb_rating && (
              <span style={styles.esrb}>{game.esrb_rating.name}</span>
            )}
          </div>
          <div style={styles.gameStats}>
            <Stat label="OCENA RAWG" value={game.rating ? `${game.rating.toFixed(1)}/5` : 'N/D'} />
            <Stat label="LICZBA OCEN" value={game.ratings_count?.toLocaleString() || '0'} />
            <Stat label="PRZEANALIZOWANE RECENZJE" value={sentimentData.totalAnalyzed} />
            <Stat label="METACRITIC" value={game.metacritic || 'N/D'} highlight={game.metacritic} />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={styles.sectionDivider}>
        <span style={styles.sectionTitle}>◆ WYNIKI ANALIZY SENTYMENTU</span>
      </div>

      {/* Main Sentiment Panel */}
      <div style={styles.mainPanel}>
        <div style={styles.gaugeSection}>
          <SentimentGauge score={sentimentData.avgScore} label={sentimentData.overallLabel} size={180} />
          <div style={styles.gaugeLabels}>
            <span style={styles.gaugeMin}>NEG</span>
            <span style={{ ...styles.gaugeVerdict, color }}>
              {sentimentData.overallLabel}
            </span>
            <span style={styles.gaugeMax}>POS</span>
          </div>
        </div>

        <div style={styles.metricsSection}>
          {/* Distribution */}
          <div style={styles.distCard}>
            <div style={styles.cardLabel}>ROZKŁAD NASTROJÓW</div>
            <DistBar label="POZYTYWNY" value={sentimentData.distribution.positive} color="#00ff88" />
            <DistBar label="MIESZANY" value={sentimentData.distribution.mixed} color="#f5c542" />
            <DistBar label="NEGATYWNY" value={sentimentData.distribution.negative} color="#ff4466" />
          </div>

          {/* Signal Analysis */}
          <div style={styles.signalCard}>
            <div style={styles.cardLabel}>ANALIZA SYGNAŁÓW</div>
            <div style={styles.signalGrid}>
              <SignalItem
                label="SYGNAŁY POZYTYWNE"
                words={sentimentData.analyses?.flatMap(a => a.positiveWords || []).filter((v, i, a) => a.indexOf(v) === i).slice(0, 6)}
                color="#00ff88"
              />
              <SignalItem
                label="SYGNAŁY NEGATYWNE"
                words={sentimentData.analyses?.flatMap(a => a.negativeWords || []).filter((v, i, a) => a.indexOf(v) === i).slice(0, 6)}
                color="#ff4466"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={styles.sectionDivider}>
        <span style={styles.sectionTitle}>◆ SZCZEGÓŁOWE RECENZJE UŻYTKOWNIKÓW</span>
      </div>

      {/* Reviews */}
      <div style={styles.reviewsGrid}>
        {reviews.slice(0, 12).map((review, i) => (
          <ReviewItem key={review.id || i} review={review} analysis={sentimentData.analyses?.[i]} index={i} />
        ))}
      </div>

      {/* Footer note */}
      <div style={styles.footerNote}>
        <span style={styles.footerIcon}>ℹ</span>
        <span style={styles.footerText}>
          Analiza sentymentu oparta na ekstrakcji słów kluczowych z {sentimentData.totalAnalyzed} recenzji użytkowników via RAWG API.
          Wyniki mają charakter orientacyjny i stanowią uzupełnienie profesjonalnej oceny redakcyjnej.
        </span>
      </div>
    </div>
  );
}

function LoadingPanel() {
  return (
    <div style={styles.loadingPanel}>
      <div style={styles.loadingRadar}>
        <div style={styles.loadingRing1}></div>
        <div style={styles.loadingRing2}></div>
        <div style={styles.loadingRing3}></div>
        <div style={styles.loadingDot}></div>
      </div>
      <div style={styles.loadingText}>SKANOWANIE RECENZJI...</div>
      <div style={styles.loadingSubtext}>Pobieranie i analiza nastrojów społeczności</div>
    </div>
  );
}

function NoData({ game }) {
  return (
    <div style={styles.noData}>
      <span style={styles.noDataIcon}>◈</span>
      <div style={styles.noDataTitle}>{game.name}</div>
      <div style={styles.noDataText}>Brak recenzji użytkowników dla tej gry.</div>
      <div style={styles.noDataSub}>RAWG może jeszcze nie mieć zindeksowanych recenzji dla tego tytułu.</div>
    </div>
  );
}

function Stat({ label, value, highlight }) {
  return (
    <div style={styles.stat}>
      <div style={styles.statLabel}>{label}</div>
      <div style={{
        ...styles.statValue,
        ...(highlight ? { color: '#f5c542' } : {}),
      }}>{value}</div>
    </div>
  );
}

function DistBar({ label, value, color }) {
  return (
    <div style={styles.distRow}>
      <span style={{ ...styles.distLabel, color: color }}>{label}</span>
      <div style={styles.distBarWrap}>
        <div style={{
          ...styles.distBarFill,
          '--target-width': `${value}%`,
          width: `${value}%`,
          background: color,
          boxShadow: `0 0 8px ${color}50`,
        }}></div>
      </div>
      <span style={{ ...styles.distPct, color }}>{value}%</span>
    </div>
  );
}

function SignalItem({ label, words, color }) {
  return (
    <div style={styles.signalItem}>
      <div style={{ ...styles.signalLabel, color }}>{label}</div>
      <div style={styles.signalWords}>
        {words && words.length > 0 ? words.map((w, i) => (
          <span key={i} style={{ ...styles.signalWord, borderColor: `${color}40`, color: `${color}cc` }}>
            {w}
          </span>
        )) : (
          <span style={styles.signalNone}>none detected</span>
        )}
      </div>
    </div>
  );
}

const SENTIMENT_LABELS_PL = {
  'POSITIVE': 'POZYTYWNY',
  'MIXED POSITIVE': 'MIESZANY POZYTYWNY',
  'NEUTRAL': 'NEUTRALNY',
  'MIXED NEGATIVE': 'MIESZANY NEGATYWNY',
  'NEGATIVE': 'NEGATYWNY',
};

function ReviewItem({ review, analysis, index }) {
  const [expanded, setExpanded] = useState(false);
  if (!analysis) return null;
  const color = getSentimentColor(analysis.score);
  const rawText = review.text || review.description || '';
  // Strip HTML tags from text
  const text = rawText.replace(/<[^>]*>/g, '').trim();
  const isLong = text.length > 150;
  const preview = isLong && !expanded ? text.slice(0, 150) + '…' : text;
  const labelPL = SENTIMENT_LABELS_PL[analysis.label] || analysis.label;

  return (
    <div style={{ ...styles.reviewItem, animationDelay: `${index * 0.05}s` }}>
      <div style={styles.reviewHeader}>
        <div style={styles.reviewUser}>
          <div style={styles.reviewAvatar}>
            {(review.user?.username || 'U')[0].toUpperCase()}
          </div>
          <span style={styles.reviewUsername}>
            {review.user?.username || `użytkownik_${index + 1}`}
          </span>
        </div>
        <div style={{ ...styles.reviewScore, color, borderColor: `${color}40` }}>
          {analysis.score}
          <span style={styles.reviewScoreLabel}> / 100</span>
        </div>
      </div>
      <div style={styles.reviewLabel}>
        <span style={{ ...styles.reviewSentiment, color }}>{labelPL}</span>
      </div>
      {text && (
        <>
          <div style={styles.reviewText}>{preview || '(brak treści)'}</div>
          {isLong && (
            <button
              style={{ ...styles.expandBtn, color, borderColor: `${color}40` }}
              onClick={() => setExpanded(e => !e)}
              onMouseEnter={e => { e.currentTarget.style.background = `${color}15`; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              {expanded ? '▲ ZWIŃ' : '▼ ROZWIŃ CAŁĄ RECENZJĘ'}
            </button>
          )}
        </>
      )}
      <div style={styles.reviewMiniBar}>
        <div style={{
          height: '2px',
          width: `${analysis.score}%`,
          background: color,
          transition: 'width 0.8s ease',
          boxShadow: `0 0 4px ${color}`,
        }}></div>
      </div>
    </div>
  );
}

const styles = {
  report: {
    animation: 'fade-in-up 0.5s ease both',
  },
  gameHeader: {
    display: 'flex',
    gap: '0',
    position: 'relative',
    overflow: 'hidden',
    minHeight: '160px',
    borderBottom: '1px solid #1e3028',
  },
  gameImageWrap: {
    position: 'absolute',
    inset: 0,
    zIndex: 0,
  },
  gameImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'brightness(0.2) saturate(0.5)',
  },
  gameImageOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(90deg, rgba(6,9,8,0.95) 40%, rgba(6,9,8,0.7) 100%)',
  },
  gameInfo: {
    position: 'relative',
    zIndex: 1,
    padding: '20px 32px',
    flex: 1,
  },
  gameMetaTop: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    marginBottom: '6px',
  },
  gameTag: {
    fontFamily: 'var(--font-mono)',
    fontSize: '9px',
    color: '#00ff88',
    letterSpacing: '2px',
  },
  gameDate: {
    fontFamily: 'var(--font-mono)',
    fontSize: '9px',
    color: '#3d5c4a',
    letterSpacing: '1px',
  },
  gameName: {
    fontFamily: 'var(--font-display)',
    fontWeight: 900,
    fontSize: 'clamp(22px, 4vw, 38px)',
    color: '#e8f5ee',
    letterSpacing: '2px',
    lineHeight: 1.1,
    marginBottom: '10px',
    textShadow: '0 2px 20px rgba(0,0,0,0.8)',
  },
  gameTags: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
    marginBottom: '16px',
  },
  platform: {
    fontSize: '14px',
  },
  genreTag: {
    fontFamily: 'var(--font-mono)',
    fontSize: '9px',
    color: '#7da890',
    background: '#0c1210',
    border: '1px solid #1e3028',
    padding: '2px 8px',
    borderRadius: '1px',
    letterSpacing: '1px',
  },
  esrb: {
    fontFamily: 'var(--font-mono)',
    fontSize: '9px',
    color: '#f5c542',
    background: '#3d301050',
    border: '1px solid #3d3010',
    padding: '2px 8px',
    borderRadius: '1px',
    letterSpacing: '1px',
  },
  gameStats: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  statLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '8px',
    color: '#3d5c4a',
    letterSpacing: '1px',
  },
  statValue: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '18px',
    color: '#00ff88',
    letterSpacing: '1px',
  },
  sectionDivider: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 32px',
    background: '#080d0b',
    borderBottom: '1px solid #1e3028',
    borderTop: '1px solid #1e3028',
  },
  sectionTitle: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    color: '#00ff88',
    letterSpacing: '3px',
  },
  mainPanel: {
    display: 'flex',
    gap: '0',
    padding: '32px',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    borderBottom: '1px solid #1e3028',
  },
  gaugeSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    paddingRight: '32px',
    borderRight: '1px solid #1e3028',
    marginRight: '32px',
    minWidth: '200px',
  },
  gaugeLabels: {
    display: 'flex',
    width: '180px',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gaugeMin: {
    fontFamily: 'var(--font-mono)',
    fontSize: '8px',
    color: '#ff4466',
    letterSpacing: '1px',
  },
  gaugeMax: {
    fontFamily: 'var(--font-mono)',
    fontSize: '8px',
    color: '#00ff88',
    letterSpacing: '1px',
  },
  gaugeVerdict: {
    fontFamily: 'var(--font-mono)',
    fontSize: '9px',
    letterSpacing: '2px',
  },
  metricsSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    minWidth: '280px',
  },
  distCard: {
    background: '#0c1210',
    border: '1px solid #1e3028',
    borderRadius: '2px',
    padding: '16px',
  },
  signalCard: {
    background: '#0c1210',
    border: '1px solid #1e3028',
    borderRadius: '2px',
    padding: '16px',
  },
  cardLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '9px',
    color: '#3d5c4a',
    letterSpacing: '2px',
    marginBottom: '12px',
  },
  distRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px',
  },
  distLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '9px',
    letterSpacing: '1px',
    width: '70px',
    flexShrink: 0,
  },
  distBarWrap: {
    flex: 1,
    height: '6px',
    background: '#1e3028',
    borderRadius: '1px',
    overflow: 'hidden',
  },
  distBarFill: {
    height: '100%',
    borderRadius: '1px',
    transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
  },
  distPct: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    width: '36px',
    textAlign: 'right',
  },
  signalGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  signalItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  signalLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '9px',
    letterSpacing: '1px',
  },
  signalWords: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
  },
  signalWord: {
    fontFamily: 'var(--font-mono)',
    fontSize: '9px',
    border: '1px solid',
    padding: '2px 6px',
    borderRadius: '1px',
    letterSpacing: '0.5px',
  },
  signalNone: {
    fontFamily: 'var(--font-mono)',
    fontSize: '9px',
    color: '#3d5c4a',
    fontStyle: 'italic',
  },
  reviewsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '12px',
    padding: '24px 32px',
    borderBottom: '1px solid #1e3028',
  },
  reviewItem: {
    background: '#0c1210',
    border: '1px solid #1e3028',
    borderRadius: '2px',
    padding: '14px',
    animation: 'fade-in-up 0.4s ease both',
  },
  reviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  reviewUser: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  reviewAvatar: {
    width: '24px',
    height: '24px',
    borderRadius: '1px',
    background: '#172219',
    border: '1px solid #2a4838',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    color: '#7da890',
  },
  reviewUsername: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    color: '#7da890',
    letterSpacing: '0.5px',
  },
  reviewScore: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '20px',
    letterSpacing: '1px',
    border: '1px solid',
    padding: '2px 8px',
    borderRadius: '1px',
  },
  reviewScoreLabel: {
    fontSize: '10px',
    fontWeight: 400,
    opacity: 0.6,
  },
  reviewLabel: {
    marginBottom: '6px',
  },
  reviewSentiment: {
    fontFamily: 'var(--font-mono)',
    fontSize: '8px',
    letterSpacing: '2px',
  },
  reviewText: {
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    color: '#7da890',
    lineHeight: 1.6,
    marginBottom: '8px',
  },
  expandBtn: {
    display: 'block',
    background: 'transparent',
    border: '1px solid',
    borderRadius: '2px',
    padding: '4px 10px',
    fontFamily: 'var(--font-mono)',
    fontSize: '9px',
    letterSpacing: '1px',
    cursor: 'pointer',
    marginBottom: '8px',
    transition: 'background 0.15s',
  },
  reviewMiniBar: {
    height: '2px',
    background: '#1e3028',
    overflow: 'hidden',
    borderRadius: '1px',
  },
  footerNote: {
    display: 'flex',
    gap: '10px',
    padding: '14px 32px',
    alignItems: 'flex-start',
    background: '#080d0b',
  },
  footerIcon: {
    color: '#3d5c4a',
    fontSize: '12px',
    flexShrink: 0,
    marginTop: '1px',
  },
  footerText: {
    fontFamily: 'var(--font-mono)',
    fontSize: '9px',
    color: '#3d5c4a',
    letterSpacing: '0.5px',
    lineHeight: 1.6,
  },
  loadingPanel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
    padding: '80px 32px',
  },
  loadingRadar: {
    position: 'relative',
    width: '80px',
    height: '80px',
  },
  loadingRing1: {
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    border: '1px solid #1e3028',
  },
  loadingRing2: {
    position: 'absolute',
    inset: '12px',
    borderRadius: '50%',
    border: '1px solid #2a4838',
    animation: 'radar-sweep 2s linear infinite',
    background: 'conic-gradient(from 0deg, rgba(0,255,136,0.2) 0deg, transparent 90deg)',
  },
  loadingRing3: {
    position: 'absolute',
    inset: '24px',
    borderRadius: '50%',
    border: '1px solid #1e3028',
  },
  loadingDot: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#00ff88',
    boxShadow: '0 0 12px #00ff88',
    animation: 'pulse-dot 1s infinite',
  },
  loadingText: {
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    color: '#00ff88',
    letterSpacing: '3px',
    animation: 'flicker 3s infinite',
  },
  loadingSubtext: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    color: '#3d5c4a',
    letterSpacing: '1px',
  },
  noData: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '60px 32px',
    textAlign: 'center',
  },
  noDataIcon: {
    fontSize: '32px',
    color: '#2a4838',
  },
  noDataTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '24px',
    color: '#7da890',
    letterSpacing: '2px',
  },
  noDataText: {
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    color: '#3d5c4a',
  },
  noDataSub: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    color: '#2a4838',
    letterSpacing: '1px',
  },
};
