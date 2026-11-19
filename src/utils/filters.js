import { DATE_FILTERS } from './constants.js';

// FILTER: all the "does this job pass?" logic lives here, in plain functions with
// no React in them, so it is easy to read, change and test.
// To filter by something new, add a check in matchesFilters() below.

const MS_PER_DAY = 86_400_000;

// What "no filters" looks like. The Filters panel's Clear button resets to this.
export const EMPTY_FILTERS = { statuses: [], when: 'any' };

// How many filters are switched on (shown as the number badge on the button).
export function countActiveFilters(filters) {
  return filters.statuses.length + (filters.when !== 'any' ? 1 : 0);
}

// Whole days between "today" and a "YYYY-MM-DD" date, in local time (never UTC,
// so a date can't shift by a day).
function daysSince(iso) {
  const [y, m, d] = String(iso ?? '').slice(0, 10).split('-').map(Number);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((today - new Date(y, m - 1, d)) / MS_PER_DAY);
}

// true = show this job. The search text matches the company OR the job title.
export function matchesFilters(application, query, filters) {
  const text = query.trim().toLowerCase();
  if (text) {
    const haystack = `${application.company_name ?? ''} ${application.job_title ?? ''}`.toLowerCase();
    if (!haystack.includes(text)) return false;
  }

  if (filters.statuses.length > 0 && !filters.statuses.includes(application.status)) return false;

  const option = DATE_FILTERS.find((item) => item.value === filters.when);
  // An invalid date gives NaN, and NaN <= 7 is false, so such a job is hidden by a date filter.
  if (option?.days && !(daysSince(application.applied_date) <= option.days)) return false;

  return true;
}