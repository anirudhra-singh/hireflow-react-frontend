// job applications analtics
import { useEffect, useState } from 'react';
import { analyticsApi } from '../api/endpoints.js';
import { Alert } from '../components/Alert.jsx';
import { Spinner } from '../components/Loading.jsx';
import { STATUSES, STATUS_LABELS } from '../utils/constants.js';
import { formatRate } from '../utils/format.js';
import { secondaryButton } from '../utils/ui.js';

function StatCard({ label, value }) {
  return (
    <div className="rounded-lg border border-gray-200 p-5">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}

export default function AnalyticsPage() {
  const [summary, setSummary] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0); 

  useEffect(() => {
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

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-gray-900"> Job Analytics</h1>

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
          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard label="Total applications" value={total} />
            <StatCard label="Conversion rate" value={formatRate(summary.conversion_rate)} />
          </div>

          <section aria-labelledby="breakdown-heading" className="rounded-lg border border-gray-200 p-5">
            <h2 id="breakdown-heading" className="mb-4 text-base font-semibold text-gray-900">
              Status breakdown
            </h2>
            <ul className="flex flex-col gap-4">
              {STATUSES.map((s) => {
                const count = Number(breakdown[s]) || 0;
                const percent = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <li key={s} className="grid grid-cols-[5.5rem_1fr_auto] items-center gap-3">
                    <span className="text-sm text-gray-700">{STATUS_LABELS[s]}</span>
                    <progress
                      value={count}
                      max={Math.max(total, 1)}
                      aria-label={`${STATUS_LABELS[s]}: ${count} of ${total}`}
                      className="h-2 w-full appearance-none overflow-hidden rounded-full bg-gray-100 [&::-moz-progress-bar]:bg-gray-800 [&::-webkit-progress-bar]:bg-gray-100 [&::-webkit-progress-value]:bg-gray-800"
                    />
                    <span className="text-right text-sm tabular-nums text-gray-600">
                      {count} ({percent}%)
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}