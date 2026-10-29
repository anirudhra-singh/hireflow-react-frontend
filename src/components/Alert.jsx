// alert component
const TONES = {
  error: 'border-rose-200 bg-rose-50 text-rose-800',
  info: 'border-gray-200 bg-gray-50 text-gray-700',
};

export function Alert({ tone = 'error', children }) {
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={`rounded-lg border px-4 py-3 text-sm ${TONES[tone]}`}
    >
      {children}
    </div>
  );
}