import Icon from './Icon.jsx';
import { useDropdown } from '../hooks/useDropdown.js';
import { STATUSES, STATUS_LABELS, STATUS_STYLES } from '../utils/constants.js';

// animation each option appears a few milliseconds after the one before it
const DELAYS = [
  '',
  '[animation-delay:20ms]',
  '[animation-delay:40ms]',
  '[animation-delay:60ms]',
  '[animation-delay:80ms]',
];


export default function StatusDropdown({ status, companyName, disabled, onChange, variant = 'field' }) {
  const { open, setOpen, wrapRef, buttonRef, listRef, close, handleKeyDown } = useDropdown();
  const styles = STATUS_STYLES[status] ?? STATUS_STYLES.applied;
  const label = STATUS_LABELS[status] ?? status;

  function choose(next) {
    close();
    if (next !== status) onChange(next);
  }

  const buttonProps = {
    ref: buttonRef,
    type: 'button',
    disabled,
    'aria-haspopup': 'menu',
    'aria-expanded': open,
    'aria-label': `Status: ${label}. Change status for ${companyName}`,
    onClick: () => setOpen((value) => !value),
  };
  const chevron = (
    <Icon
      name="chevron"
      className={`size-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''} ${variant === 'field' ? 'ml-auto text-gray-500' : ''}`}
    />
  );

  return (
    <div
      ref={wrapRef}
      onKeyDown={handleKeyDown}
      className={variant === 'field' ? 'relative' : 'relative inline-block'}
    >
      {variant === 'field' ? (
        <button
          {...buttonProps}
          className="flex min-h-11 w-full items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-900 transition duration-150 hover:bg-gray-50 disabled:opacity-60"
        >
          <span className={`h-2.5 w-2.5 rounded-full ${styles.dot}`} aria-hidden="true" />
          {label}
          {chevron}
        </button>
      ) : (
        <button {...buttonProps} className="inline-flex min-h-11 items-center disabled:opacity-60">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[13px] font-semibold ${styles.pill}`}>
            <span className={`h-2 w-2 rounded-full ${styles.dot}`} aria-hidden="true" />
            {label}
            {chevron}
          </span>
        </button>
      )}

      {open && (
        <div
          ref={listRef}
          role="menu"
          data-dropdown
          aria-label={`Change status for ${companyName}`}
          className={`absolute top-full z-20 mt-0.5 flex min-w-35 origin-top-left animate-dd-in flex-col gap-1 rounded-xl border border-gray-200 bg-white p-1.25 shadow-xl shadow-violet-900/15 ${
            variant === 'field' ? 'right-0 left-0' : 'left-0'
          }`}
        >
          {STATUSES.map((s, index) => (
            <button
              key={s}
              type="button"
              role="menuitemradio"
              aria-checked={s === status}
              onClick={() => choose(s)}
              className={`flex min-h-8.5 w-full animate-item-in items-center rounded-lg border-[1.5px] px-3 text-left text-[13px] font-semibold transition duration-150 hover:translate-x-0.5 pointer-coarse:min-h-11 ${DELAYS[index]} ${STATUS_STYLES[s].pill} ${
                s === status ? STATUS_STYLES[s].outline : 'border-transparent'
              }`}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}