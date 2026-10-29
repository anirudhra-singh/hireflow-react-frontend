import { CONVERSION_RATE_SCALE } from './constants.js';


export function todayISO() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}


export function formatDate(iso) {
  const [y, m, d] = String(iso ?? '').slice(0, 10).split('-').map(Number);
  if (!y || !m || !d) return '';
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatRate(value) {
  const percent = Number(value) * CONVERSION_RATE_SCALE;
  if (!Number.isFinite(percent)) return '0%';
  return `${Math.round(percent * 10) / 10}%`;
}