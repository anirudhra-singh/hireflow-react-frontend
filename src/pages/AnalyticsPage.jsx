// job applications analtics
import { useEffect, useMemo, useState } from 'react';
import { analyticsApi } from '../api/endpoints.js';
import { useApplications } from '../hooks/useApplications.js';
import { Alert } from '../components/Alert.jsx';
import { Spinner } from '../components/Loading.jsx';
import { STATUSES, STATUS_LABELS, STATUS_STYLES } from '../utils/constants.js';
import { formatRate } from '../utils/format.js';
import { weeklyCounts } from '../utils/insights.js';
import { secondaryButton } from '../utils/ui.js';

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

// Donut chart = one SVG circle per status. Trick: the circle's circumference is
// 100 units (r = 15.9155), so strokeDasharray "pct rest" draws exactly pct%.
// SVG attributes are not inline styles, so a strict CSP allows them.
function Donut({ counts, total }) {
  let offset = 25; // 25 starts the first slice at 12 o'clock
  return (
    <svg viewBox="0 0 42 42" className="size-40 shrink-0" role="img" aria-label={`${total} applications by status`}>
      <circle cx="21" cy="21" r="15.9155" fill="none" strokeWidth="6" className="stroke-slate-100" />
      {STATUSES.filter((s) => counts[s] > 0).map((s) => {
        const percent = (counts[s] / total) * 100;
        const slice = (
          <circle
            key={s}
            cx="21"
            cy="21"
            r="15.9155"
            fill="none"
            strokeWidth="6"
            strokeDasharray={`${percent} ${100 - percent}`}
            strokeDashoffset={offset}
            className={STATUS_STYLES[s].stroke}
          />
        );
        offset -= percent;
        return slice;
      })}
      <text x="21" y="23.5" textAnchor="middle" className="fill-gray-900 text-[8px] font-bold">
        {total}
      </text>
    </svg>
  );
}

function WeeklyBars({ counts }) {
  const max = Math.max(1, ...counts);
  return (
    <svg viewBox="0 0 240 110" className="w-full" role="img" aria-label="Applications per week, last 6 weeks">
      {counts.map((n, i) => {
        const height = (n / max) * 70;
        const x = i * 40 + 8;
        return (
          // Fixed positions in a fixed-length list, so the index is a safe key here.
          <g key={i}>
            <rect x={x} y={88 - height} width="28" height={height} rx="4" className="fill-violet-700" />
            {n > 0 && (
              <text x={x + 14} y={83 - height} textAnchor="middle" className="fill-gray-900 text-[9px]">
                {n}
              </text>
            )}
            <text x={x + 14} y="104" textAnchor="middle" className="fill-gray-600 text-[9px]">
              {i === counts.length - 1 ? 'Now' : `${counts.length - 1 - i}w`}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function AnalyticsPage() {
  const [summary, setSummary] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0); // bumping this re-runs the effect (retry)

  // The weekly chart needs the individual applications (their dates), which the
  // summary endpoint doesn't contain, so we reuse the list hook.
  const { applications } = useApplications();
  const weekly = useMemo(() => weeklyCounts(applications), [applications]);

  useEffect(() => {
    // `ignore`: if the user leaves before the response arrives, skip setState on
    // a page that no longer exists (a classic useEffect pitfall).
    let ignore = false;
    analyticsApi
      .summary()
      .then((data) => {
        if (ignore) return;
        setSummary(data);
        setStatus('ready');
      })
      .catch((err) => {
        if (ignore) return;
        setError(err.message);
        setStatus('error');
      });
    return () => {
      ignore = true;
    };
  }, [attempt]);

  function retry() {
    setStatus('loading');
    setAttempt((n) => n + 1);
  }

  const total = Number(summary?.total_applications) || 0;
  const breakdown = summary?.status_breakdown ?? {};
  const counts = Object.fromEntries(STATUSES.map((s) => [s, Number(breakdown[s]) || 0]));

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Analytics</h1>

      {status === 'loading' && <Spinner label="Loading analytics" />}

      {status === 'error' && (
        <div className="flex flex-col items-start gap-3">
          <Alert>{error}</Alert>
          <button type="button" className={secondaryButton} onClick={retry}>
            Try again
          </button>
        </div>
      )}

      {status === 'ready' && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total applications" value={total} />
            <StatCard label="Interviewing" value={counts.interview} />
            <StatCard label="Offers" value={counts.offer} />
            <StatCard label="Conversion rate" value={formatRate(summary.conversion_rate)} />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <section aria-labelledby="breakdown-heading" className="rounded-2xl border border-gray-200 bg-white p-5">
              <h2 id="breakdown-heading" className="mb-4 text-base font-semibold text-gray-900">
                Status breakdown
              </h2>
              <div className="flex flex-wrap items-center gap-6">
                {total > 0 && <Donut counts={counts} total={total} />}
                <ul className="flex flex-col gap-2 text-sm">
                  {STATUSES.map((s) => (
                    <li key={s} className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-sm ${STATUS_STYLES[s].dot}`} aria-hidden="true" />
                      <span className="text-gray-800">{STATUS_LABELS[s]}</span>
                      <span className="ml-auto pl-4 tabular-nums text-gray-600">
                        {counts[s]} ({total ? Math.round((counts[s] / total) * 100) : 0}%)
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section aria-labelledby="weekly-heading" className="rounded-2xl border border-gray-200 bg-white p-5">
              <h2 id="weekly-heading" className="mb-4 text-base font-semibold text-gray-900">
                Applications per week
              </h2>
              <WeeklyBars counts={weekly} />
            </section>
          </div>
        </>
      )}
    </div>
  );
}