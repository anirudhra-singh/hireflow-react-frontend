import { STATUS_LABELS } from '../utils/constants.js';

const STYLES = {
  applied: 'bg-gray-100 text-gray-700',
  interview: 'bg-sky-50 text-sky-800',
  offer: 'bg-emerald-50 text-emerald-800',
  rejected: 'bg-rose-50 text-rose-800',
  withdrawn: 'bg-amber-50 text-amber-800',
};

export default function StatusBadge({ status }) {
  const style = STYLES[status] ?? STYLES.applied; 
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${style}`}
    >
      {STATUS_LABELS[status] ?? String(status)}
    </span>
  );
}