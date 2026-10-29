import { useMemo } from 'react';
import { useApplications } from '../hooks/useApplications.js';
import StatusBadge from '../components/StatusBadge.jsx';
import { Alert } from '../components/Alert.jsx';
import { Spinner } from '../components/Loading.jsx';
import { STATUS_STYLES } from '../utils/constants.js';
import { buildTimeline } from '../utils/insights.js';
import { formatDate } from '../utils/format.js';
import { secondaryButton } from '../utils/ui.js';

export default function TimelinePage() {
  const { applications, status, error, reload } = useApplications();
  const events = useMemo(() => buildTimeline(applications), [applications]);

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Timeline</h1>

      {status === 'loading' && <Spinner label="Loading timeline" />}

      {status === 'error' && (
        <div className="flex flex-col items-start gap-3">
          <Alert>{error}</Alert>
          <button type="button" className={secondaryButton} onClick={reload}>
            Try again
          </button>
        </div>
      )}

      {status === 'ready' && events.length === 0 && (
        <p className="text-sm text-gray-600">Nothing here yet. Add a job on the Board to start your timeline.</p>
      )}

      {status === 'ready' && events.length > 0 && (
        <>
        {/* timeline style */}
          <ol className="flex max-w-2xl flex-col gap-4 border-l-2 border-gray-200 pl-5">
            {events.map((event) => (
              <li key={event.key} className="relative flex flex-col gap-1">
                {/* The dot sits on the vertical line. Decorative: the status is also text. */}
                <span
                  className={`absolute top-1.5 -left-[27px] h-3 w-3 rounded-full border-2 border-slate-50 ${STATUS_STYLES[event.status]?.dot ?? 'bg-gray-400'}`}
                  aria-hidden="true"
                />
                <time className="text-xs text-gray-600" dateTime={event.date}>
                  {formatDate(event.date)}
                </time>
                <div className="flex flex-wrap items-start justify-between gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5">
                  <div className="min-w-0">
                    <p className="break-words text-sm font-semibold text-gray-900">{event.title}</p>
                    <p className="break-words text-xs text-gray-600">{event.subtitle}</p>
                  </div>
                  <StatusBadge status={event.status} />
                </div>
              </li>
            ))}
          </ol>
          <p className="max-w-2xl text-xs text-gray-600">
            Built from each job’s applied date and last-updated date. The API does not keep a full status history.
          </p>
        </>
      )}
    </div>
  );
}