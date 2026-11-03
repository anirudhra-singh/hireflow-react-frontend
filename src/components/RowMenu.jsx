import Icon from './Icon.jsx';
import { useDropdown } from '../hooks/useDropdown.js';

export default function RowMenu({ companyName, disabled, onEdit, onDelete }) {
  const { open, setOpen, wrapRef, buttonRef, listRef, handleKeyDown } = useDropdown();


  function run(action) {
    setOpen(false);
    action();
  }

  const itemClass =
    'flex min-h-8.5 w-full animate-item-in items-center gap-2.5 rounded-lg px-2.5 text-left text-[13px] font-medium transition duration-150 pointer-coarse:min-h-11';

  return (
    <div ref={wrapRef} onKeyDown={handleKeyDown} className="relative">
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Actions for ${companyName}`}
        onClick={() => setOpen((value) => !value)}
        className={`grid size-11 place-items-center rounded-xl text-gray-600 transition duration-150 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-60 ${
          open ? 'bg-gray-100 text-gray-900' : ''
        }`}
      >
        <Icon name="dots" className="size-5" />
      </button>

      {open && (
        <div
          ref={listRef}
          role="menu"
          aria-label={`Actions for ${companyName}`}
          className="absolute top-full right-0 z-20 -mt-1 flex min-w-34 origin-top-right animate-dd-in flex-col rounded-xl border border-gray-200 bg-white p-1 shadow-xl shadow-violet-900/15"
        >
          <button type="button" role="menuitem" onClick={() => run(onEdit)} className={`${itemClass} text-gray-900 hover:bg-gray-100`}>
            <Icon name="pencil" className="size-4" />
            Edit
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => run(onDelete)}
            className={`${itemClass} text-rose-700 [animation-delay:20ms] hover:bg-rose-50`}
          >
            <Icon name="trash" className="size-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}