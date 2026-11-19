import Icon from './Icon.jsx';
import { useDropdown } from '../hooks/useDropdown.js';
import { DATE_FILTERS, STATUSES, STATUS_LABELS, STATUS_STYLES } from '../utils/constants.js';
import { EMPTY_FILTERS, countActiveFilters } from '../utils/filters.js';
import { primaryButton, secondaryButton, toolButton } from '../utils/ui.js';

// FILTER: the "Filters" button and its panel. Two groups:
//   Status        - pick any number of stages (empty = all stages)
//   Date applied  - pick one range
// `filters` is { statuses: [...], when: 'any' | '7' | '30' } and lives in the page.
// This component only changes it through onChange. The actual filtering is
// matchesFilters() in utils/filters.js.
export default function FiltersMenu({ filters, onChange }) {
  // menu: false = panel mode, so Tab moves through the chips instead of closing it.
  const { open, setOpen, wrapRef, buttonRef, listRef, close, handleKeyDown, handleBlur } = useDropdown({ menu: false });
  const active = countActiveFilters(filters);

  function toggleStatus(status) {
    const has = filters.statuses.includes(status);
    onChange({
      ...filters,
      statuses: has ? filters.statuses.filter((s) => s !== status) : [...filters.statuses, status],
    });
  }

  const chip = 'inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-[13px] font-semibold transition duration-150 pointer-coarse:min-h-11';

  return (
    <div ref={wrapRef} onKeyDown={handleKeyDown} onBlur={handleBlur} className="relative flex-1 sm:flex-none">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`${toolButton} w-full justify-between sm:w-auto`}
      >
        <span className="inline-flex items-center gap-2">
          <Icon name="filter" className="size-4" />
          Filters
          {active > 0 && (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-violet-700 px-1 text-[11px] font-bold text-white">
              {active}
            </span>
          )}
        </span>
      </button>

      {open && (
        <div
          ref={listRef}
          role="dialog"
          aria-label="Filters"
          // On phones the panel opens to the right of the button (left-0), on larger
          // screens to the left (sm:right-0), so it never runs off the screen.
          className="absolute top-full left-0 z-20 mt-1 flex w-[min(18rem,calc(100vw-2rem))] origin-top-left animate-dd-in flex-col gap-2 rounded-xl border border-gray-200 bg-white p-3.5 shadow-xl shadow-violet-900/15 sm:right-0 sm:left-auto sm:origin-top-right"
        >
          <p className="text-[11px] font-bold tracking-wider text-gray-600 uppercase">Status</p>
          <div className="flex flex-wrap gap-1.5">
            {STATUSES.map((status) => {
              const pressed = filters.statuses.includes(status);
              const styles = STATUS_STYLES[status];
              return (
                <button
                  key={status}
                  type="button"
                  aria-pressed={pressed}
                  onClick={() => toggleStatus(status)}
                  className={`${chip} ${pressed ? `${styles.pill} ${styles.outline}` : 'border-gray-200 bg-white text-gray-800 hover:bg-gray-50'}`}
                >
                  <span className={`h-2 w-2 rounded-full ${styles.dot}`} aria-hidden="true" />
                  {STATUS_LABELS[status]}
                </button>
              );
            })}
          </div>

          <p className="mt-1 text-[11px] font-bold tracking-wider text-gray-600 uppercase">Date applied</p>
          <div className="flex flex-wrap gap-1.5">
            {DATE_FILTERS.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={filters.when === option.value}
                onClick={() => onChange({ ...filters, when: option.value })}
                className={`${chip} ${
                  filters.when === option.value
                    ? 'border-violet-700 bg-violet-100 text-violet-800'
                    : 'border-gray-200 bg-white text-gray-800 hover:bg-gray-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <button type="button" className={`${secondaryButton} min-h-10`} disabled={active === 0} onClick={() => onChange(EMPTY_FILTERS)}>
              Clear
            </button>
            <button type="button" className={`${primaryButton} min-h-10`} onClick={() => close()}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}