import { useAuth } from '../hooks/useAuth.js';
import ProfileMenu from './ProfileMenu.jsx';
import { primaryButton } from '../utils/ui.js';

// HEADER: the top of the Board page: the small "AI job tracker" line, the
// "Welcome back" heading with the logged-in user's name, the profile avatar and
// the Add job button. To change the wording, edit the two lines below.
// On phones (max-sm:) the heading takes its own row, and the avatar + a wide
// Add job button share the next row.
export default function PageHeader({ onAdd }) {
  const { user } = useAuth();

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
      <div className="min-w-0 flex-[1_1_14rem] max-sm:basis-full">
        <p className="text-[13px] font-bold tracking-wide text-violet-700">AI job tracker</p>
        {/* user.full_name is server data, rendered as plain text */}
        <h1 className="text-xl font-bold wrap-break-word text-gray-900 sm:text-2xl">Welcome back, {user.full_name}</h1>
      </div>

      <div className="flex items-center gap-3 max-sm:basis-full">
        <ProfileMenu />
        <button type="button" className={`${primaryButton} max-sm:flex-1`} onClick={onAdd}>
          + Add job
        </button>
      </div>
    </div>
  );
}