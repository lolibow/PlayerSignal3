// Sentiment analysis engine for game reviews

const POSITIVE_WORDS = [
  'amazing', 'excellent', 'outstanding', 'brilliant', 'masterpiece', 'perfect',
  'incredible', 'fantastic', 'wonderful', 'superb', 'great', 'good', 'enjoyable',
  'fun', 'immersive', 'beautiful', 'stunning', 'epic', 'awesome', 'love', 'loved',
  'best', 'recommend', 'worth', 'polished', 'refined', 'smooth', 'innovative',
  'creative', 'engaging', 'compelling', 'addictive', 'satisfying', 'rewarding',
  'impressive', 'solid', 'well-made', 'well made', 'well-designed', 'well designed',
  'must play', 'must-play', 'gem', 'landmark', 'revolutionary', 'groundbreaking',
  'flawless', 'top-notch', 'top notch', 'exceptional', 'thrilling', 'captivating',
  'phenomenal', 'terrific', 'magnificent', 'delightful', 'charming', 'polished',
];

const NEGATIVE_WORDS = [
  'terrible', 'awful', 'bad', 'poor', 'mediocre', 'disappointing', 'disappointed',
  'broken', 'buggy', 'bugs', 'glitches', 'glitchy', 'crash', 'crashes', 'unplayable',
  'boring', 'repetitive', 'tedious', 'frustrating', 'annoying', 'grindy', 'grind',
  'worst', 'hate', 'hated', 'avoid', 'overrated', 'overhyped', 'waste', 'wasted',
  'unfinished', 'incomplete', 'lazy', 'cash grab', 'cashgrab', 'predatory',
  'microtransactions', 'pay-to-win', 'pay to win', 'p2w', 'unfair', 'unbalanced',
  'ugly', 'outdated', 'sluggish', 'clunky', 'stiff', 'shallow', 'empty',
  'soulless', 'generic', 'derivative', 'dull', 'bland', 'forgettable',
  'unstable', 'not worth', 'refund', 'regret',
];

const NEUTRAL_MODIFIERS = ['not', 'never', 'no', 'without', 'lack', 'lacks', 'lacking'];

export function analyzeSentiment(text) {
  if (!text || text.trim().length < 10) {
    return { score: 50, label: 'NEUTRAL', confidence: 0, positiveCount: 0, negativeCount: 0 };
  }

  const lower = text.toLowerCase();
  const words = lower.split(/\s+/);

  let positiveHits = [];
  let negativeHits = [];

  // Check multi-word phrases first
  const allKeywords = [...POSITIVE_WORDS, ...NEGATIVE_WORDS].sort((a, b) => b.length - a.length);
  const usedPositive = new Set();
  const usedNegative = new Set();

  for (const kw of POSITIVE_WORDS) {
    if (lower.includes(kw)) {
      const idx = lower.indexOf(kw);
      // Check for negation in the 3 words before
      const before = lower.substring(Math.max(0, idx - 30), idx);
      const hasNegation = NEUTRAL_MODIFIERS.some(m => before.endsWith(m + ' ') || before.includes(m + ' '));
      if (hasNegation) {
        negativeHits.push(kw);
      } else {
        positiveHits.push(kw);
      }
    }
  }

  for (const kw of NEGATIVE_WORDS) {
    if (lower.includes(kw)) {
      const idx = lower.indexOf(kw);
      const before = lower.substring(Math.max(0, idx - 30), idx);
      const hasNegation = NEUTRAL_MODIFIERS.some(m => before.endsWith(m + ' ') || before.includes(m + ' '));
      if (hasNegation) {
        positiveHits.push(kw);
      } else {
        negativeHits.push(kw);
      }
    }
  }

  const pos = positiveHits.length;
  const neg = negativeHits.length;
  const total = pos + neg;

  if (total === 0) {
    return { score: 50, label: 'NEUTRAL', confidence: 20, positiveCount: 0, negativeCount: 0, positiveWords: [], negativeWords: [] };
  }

  const rawScore = pos / total;
  // Map to 0-100 range with some centering
  const score = Math.round(20 + rawScore * 60 + (pos - neg) * 2);
  const clampedScore = Math.min(100, Math.max(0, score));

  const confidence = Math.min(95, Math.round(40 + total * 5));

  let label;
  if (clampedScore >= 72) label = 'POSITIVE';
  else if (clampedScore >= 55) label = 'MIXED POSITIVE';
  else if (clampedScore >= 45) label = 'NEUTRAL';
  else if (clampedScore >= 28) label = 'MIXED NEGATIVE';
  else label = 'NEGATIVE';

  return {
    score: clampedScore,
    label,
    confidence,
    positiveCount: pos,
    negativeCount: neg,
    positiveWords: [...new Set(positiveHits)].slice(0, 5),
    negativeWords: [...new Set(negativeHits)].slice(0, 5),
  };
}

export function aggregateSentiments(reviews) {
  if (!reviews || reviews.length === 0) return null;

  const analyses = reviews.map(r => analyzeSentiment(r.text || r.description || ''));
  const scores = analyses.map(a => a.score);
  const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

  const dist = { positive: 0, mixed: 0, negative: 0 };
  analyses.forEach(a => {
    if (a.score >= 60) dist.positive++;
    else if (a.score >= 40) dist.mixed++;
    else dist.negative++;
  });

  const total = reviews.length;

  let overallLabel;
  if (avgScore >= 72) overallLabel = 'POSITIVE';
  else if (avgScore >= 55) overallLabel = 'MIXED POSITIVE';
  else if (avgScore >= 45) overallLabel = 'NEUTRAL';
  else if (avgScore >= 28) overallLabel = 'MIXED NEGATIVE';
  else overallLabel = 'NEGATIVE';

  return {
    avgScore,
    overallLabel,
    distribution: {
      positive: Math.round((dist.positive / total) * 100),
      mixed: Math.round((dist.mixed / total) * 100),
      negative: Math.round((dist.negative / total) * 100),
    },
    totalAnalyzed: total,
    analyses,
  };
}

export function getSentimentColor(score) {
  if (score >= 70) return '#00ff88';
  if (score >= 50) return '#f5c542';
  return '#ff4466';
}

export function getSentimentGlow(score) {
  if (score >= 70) return 'rgba(0,255,136,0.3)';
  if (score >= 50) return 'rgba(245,197,66,0.3)';
  return 'rgba(255,68,102,0.3)';
}
