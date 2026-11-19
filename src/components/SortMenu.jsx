import Icon from './Icon.jsx';
import { useDropdown } from '../hooks/useDropdown.js';
import { SORTS } from '../utils/constants.js';
import { toolButton } from '../utils/ui.js';

// SORT: the "Sort: Latest" button and its small menu. The choices come from SORTS
// in utils/constants.js. The page does the actual sorting (compareByDate).
export default function SortMenu({ value, onChange }) {
  const { open, setOpen, wrapRef, buttonRef, listRef, close, handleKeyDown } = useDropdown();
  const current = SORTS.find((option) => option.value === value) ?? SORTS[0];

  function choose(next) {
    close();
    onChange(next);
  }

  return (
    <div ref={wrapRef} onKeyDown={handleKeyDown} className="relative flex-1 sm:flex-none">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`${toolButton} w-full justify-between sm:w-auto`}
      >
        Sort: {current.label}
        <Icon name="chevron" className={`size-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          ref={listRef}
          role="menu"
          aria-label="Sort"
          className="absolute top-full right-0 z-20 mt-1 flex min-w-36 origin-top-right animate-dd-in flex-col rounded-xl border border-gray-200 bg-white p-1 shadow-xl shadow-violet-900/15"
        >
          {SORTS.map((option) => {
            const selected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="menuitemradio"
                aria-checked={selected}
                onClick={() => choose(option.value)}
                className={`flex min-h-8.5 w-full items-center gap-2 rounded-lg px-2.5 text-left text-[13px] transition duration-150 hover:bg-gray-100 pointer-coarse:min-h-11 ${
                  selected ? 'font-bold text-violet-700' : 'font-medium text-gray-900'
                }`}
              >
                {option.menuLabel}
                {selected && <Icon name="check" className="ml-auto size-3.5" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}