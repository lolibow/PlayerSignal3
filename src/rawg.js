const RAWG_KEY = '71d4ecb0155048498283f09b1502aa60';
const BASE = 'https://api.rawg.io/api';

export async function searchGames(query) {
  const url = `${BASE}/games?key=${RAWG_KEY}&search=${encodeURIComponent(query)}&page_size=8`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`RAWG error: ${res.status}`);
  const data = await res.json();
  return data.results || [];
}

export async function getGameDetails(gameId) {
  const url = `${BASE}/games/${gameId}?key=${RAWG_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`RAWG error: ${res.status}`);
  return res.json();
}

export async function getGameReviews(gameId) {
  const url = `${BASE}/games/${gameId}/reviews?key=${RAWG_KEY}&page_size=20`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`RAWG error: ${res.status}`);
  const data = await res.json();
  return data.results || [];
}

export async function getGameScreenshots(gameId) {
  const url = `${BASE}/games/${gameId}/screenshots?key=${RAWG_KEY}&page_size=4`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`RAWG error: ${res.status}`);
  const data = await res.json();
  return data.results || [];
}

export function getRatingLabel(rating) {
  if (rating >= 4.5) return 'EXCEPTIONAL';
  if (rating >= 4.0) return 'RECOMMENDED';
  if (rating >= 3.0) return 'AVERAGE';
  if (rating >= 2.0) return 'BELOW AVERAGE';
  return 'POOR';
}

export function formatDate(dateStr) {
  if (!dateStr) return 'TBA';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function getPlatformIcons(platforms) {
  if (!platforms) return [];
  const map = {
    'pc': '🖥',
    'playstation': '🎮',
    'xbox': '🎯',
    'nintendo': '🕹',
    'ios': '📱',
    'android': '📱',
    'mac': '🍎',
    'linux': '🐧',
  };
  return platforms
    .map(p => p.platform?.slug || '')
    .map(slug => {
      const key = Object.keys(map).find(k => slug.includes(k));
      return key ? map[key] : null;
    })
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, 5);
}
