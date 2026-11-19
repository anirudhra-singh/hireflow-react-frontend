import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { useDropdown } from '../hooks/useDropdown.js';
import Icon from './Icon.jsx';

// PROFILE: the round avatar at the top right. Click it for a small menu with who
// you are signed in as, and Log out. There is no profile page in the app yet; if
// you add one later, add a "Profile" button in the list below.
export default function ProfileMenu() {
  const { user, logout } = useAuth();
  const { open, setOpen, wrapRef, buttonRef, listRef, handleKeyDown } = useDropdown();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true); // disables the button so a double click can't fire twice
    await logout(); // logging out unmounts the page, so no reset is needed
  }

  return (
    <div ref={wrapRef} onKeyDown={handleKeyDown} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Profile menu for ${user.full_name}`}
        onClick={() => setOpen((value) => !value)}
        className="grid size-11 place-items-center rounded-full border-2 border-violet-100 bg-violet-100 text-base font-bold text-violet-800 transition duration-150 hover:scale-105 hover:ring-4 hover:ring-violet-700/15"
      >
        {/* user.full_name is server data, shown as plain text */}
        {user.full_name?.[0]?.toUpperCase() ?? '?'}
      </button>

      {open && (
        <div
          ref={listRef}
          role="menu"
          aria-label="Profile"
          className="absolute top-full right-0 z-20 mt-1 w-56 origin-top-right animate-dd-in rounded-xl border border-gray-200 bg-white p-1 shadow-xl shadow-violet-900/15"
        >
          <p className="mb-1 border-b border-gray-200 px-2.5 py-2 text-[13px] wrap-break-word text-gray-600">
            Signed in as <strong className="text-gray-900">{user.full_name}</strong>
          </p>
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex min-h-8.5 w-full items-center gap-2.5 rounded-lg px-2.5 text-left text-[13px] font-medium text-gray-900 transition duration-150 hover:bg-gray-100 disabled:opacity-60 pointer-coarse:min-h-11"
          >
            <Icon name="logout" className="size-4" />
            {loggingOut ? 'Signing out…' : 'Log out'}
          </button>
        </div>
      )}
    </div>
  );
}