import { STATUS_LABELS } from './constants.js';

const MS_PER_DAY = 86_400_000;

// using local midnight so dates never shift by a day
function parseLocalDate(iso) {
  const [y, m, d] = String(iso ?? '').slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d);
}

// timeline generator
export function buildTimeline(applications) {
  const events = [];
  for (const app of applications) {
    const applied = String(app.applied_date ?? '').slice(0, 10);
    events.push({
      key: `${app.id}-applied`,
      date: applied,
      status: 'applied',
      title: `Applied to ${app.company_name}`,
      subtitle: app.job_title,
    });

    const updated = String(app.updated_at ?? '').slice(0, 10);
    if (app.status !== 'applied' && updated > applied) {
      events.push({
        key: `${app.id}-updated`,
        date: updated,
        status: app.status,
        title: `${app.company_name} updated · now ${STATUS_LABELS[app.status] ?? app.status}`,
        subtitle: app.job_title,
      });
    }
  }
  return events.sort((a, b) => b.date.localeCompare(a.date)); // newest first
}

// applications per week 
export function weeklyCounts(applications, weeks = 6) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const counts = Array(weeks).fill(0);

  for (const app of applications) {
    const days = Math.round((today - parseLocalDate(app.applied_date)) / MS_PER_DAY);
    const bucket = Math.floor(days / 7); 
    if (days >= 0 && bucket < weeks) counts[weeks - 1 - bucket] += 1;
  }
  return counts;
}