import { useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import { STATUSES, STATUS_LABELS, STATUS_STYLES } from '../utils/constants.js';


export default function StatusPicker({ status, companyName, disabled, onChange }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const listRef = useRef(null);


  useEffect(() => {
    if (open) listRef.current?.querySelector('button')?.focus();
  }, [open]);

  function handleKeyDown(event) {
    if (event.key === 'Escape' && open) {
      setOpen(false);
      buttonRef.current?.focus(); 
      return;
    }
    if (open && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      event.preventDefault();
      const items = [...listRef.current.querySelectorAll('button')];
      const index = items.indexOf(document.activeElement);
      const step = event.key === 'ArrowDown' ? 1 : -1;
      items[(index + step + items.length) % items.length].focus();
    }
  }

  function choose(next) {
    setOpen(false);
    onChange(next);
  }

  return (
    <div onKeyDown={handleKeyDown} className="flex flex-col gap-1.5">
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        aria-expanded={open}
        aria-label={`Status: ${STATUS_LABELS[status]}. Change status for ${companyName}`}
        onClick={() => setOpen((value) => !value)}
        className="flex min-h-11 w-full items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-900 hover:bg-gray-50 disabled:opacity-60"
      >
        <span className={`h-2.5 w-2.5 rounded-full ${STATUS_STYLES[status]?.dot ?? 'bg-gray-400'}`} aria-hidden="true" />
        {STATUS_LABELS[status] ?? status}
        <Icon name="chevron" className="ml-auto size-3.5 text-gray-500" />
      </button>

      {open && (
        <div ref={listRef} role="group" aria-label="Move to" className="flex flex-wrap gap-1.5">
          {STATUSES.filter((s) => s !== status).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => choose(s)}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 text-[13px] font-medium text-gray-900 hover:border-violet-700 hover:bg-violet-50"
            >
              <span className={`h-2 w-2 rounded-full ${STATUS_STYLES[s].dot}`} aria-hidden="true" />
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}