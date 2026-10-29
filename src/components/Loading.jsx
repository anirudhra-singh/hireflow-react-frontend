export function Spinner({ label = 'Loading' }) {
  return (
    <span role="status" className="inline-flex items-center gap-2 text-sm text-gray-600">
      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
      <span>{label}</span>
    </span>
  );
}

export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border border-gray-200 p-5" aria-hidden="true">
      <div className="h-4 w-1/2 rounded bg-gray-100" />
      <div className="mt-3 h-3 w-1/3 rounded bg-gray-100" />
      <div className="mt-6 h-3 w-full rounded bg-gray-100" />
      <div className="mt-2 h-3 w-4/5 rounded bg-gray-100" />
    </div>
  );
}