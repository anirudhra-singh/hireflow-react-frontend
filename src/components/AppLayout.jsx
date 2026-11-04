import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { SidebarProvider } from '../context/SidebarProvider.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useSidebar } from '../hooks/useSidebar.js';
import DemoBanner from './DemoBanner.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';
import ServerStatus from './ServerStatus.jsx';
import { SidebarBody, SidebarBrand, SidebarLabel, SidebarLink } from './Sidebar.jsx';

// SIDEBAR: the menu items. To add a page, add a line here AND a <Route> in App.jsx.
const NAV_ITEMS = [
  { to: '/', label: 'Board', icon: 'board', end: true },
  { to: '/timeline', label: 'Timeline', icon: 'timeline', end: false },
  { to: '/analytics', label: 'Analytics', icon: 'analytics', end: false },
];

// SIDEBAR: the two widths. The LEFT column of the grid is the sidebar, the RIGHT
// column is your page. minmax(0,1fr) is the important part: a plain 1fr can never
// shrink below its content's natural width, so a wide board used to stretch the
// whole page sideways. minmax(0,1fr) lets the page column shrink to what is left.
// To change the widths, change 3.75rem (60px) and 17.5rem (280px) here.
const COLLAPSED = 'lg:grid-cols-[3.75rem_minmax(0,1fr)]';
const EXPANDED = 'lg:grid-cols-[17.5rem_minmax(0,1fr)]';

function Layout() {
  const { user, logout } = useAuth();
  const { open } = useSidebar();
  const location = useLocation();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true); // disables the button so a double click can't fire twice
    await logout(); // logging out unmounts this layout, so no reset is needed
  }

  return (
    <div className="min-h-dvh">
      {/* SIDEBAR: the grid column width animates (transition-[grid-template-columns]),
          so the page is smoothly PUSHED aside when the sidebar expands. */}
      <div className={`lg:grid transition-[grid-template-columns] duration-300 ease-out ${open ? EXPANDED : COLLAPSED}`}>
        <SidebarBody>
          <SidebarBrand />

          <nav aria-label="Main" className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <SidebarLink key={item.to} {...item} />
            ))}
          </nav>

          {/* mt-auto pushes the account block to the bottom of the screen. */}
          <div className="mt-auto flex flex-col gap-0.5 border-t border-neutral-200 pt-3 dark:border-neutral-700">
            <SidebarLabel className="mx-1.75 mb-1 text-[11px] font-semibold tracking-widest text-neutral-500 uppercase">
              Account
            </SidebarLabel>
            <div className="flex h-10 items-center gap-3 pl-1">
              <span
                className="grid size-6 shrink-0 place-items-center rounded-full bg-violet-100 text-xs font-bold text-violet-800"
                aria-hidden="true"
              >
                {/* user.full_name is server data, shown as plain text */}
                {user.full_name?.[0]?.toUpperCase() ?? '?'}
              </span>
              <SidebarLabel className="max-w-40 truncate text-sm text-neutral-700 dark:text-neutral-200">
                {user.full_name}
              </SidebarLabel>
            </div>
            <SidebarLink icon="logout" label={loggingOut ? 'Signing out…' : 'Log out'} onClick={handleLogout} disabled={loggingOut} />
          </div>
        </SidebarBody>

        {/* min-w-0 is the other half of the fix: without it this column refuses to
            get narrower than the board inside it. */}
        <div className="min-w-0">
          {/* The banner lives HERE, not above the grid, so the sidebar can start at the very top
              of the screen and its bottom part (Log out) is never pushed off-screen. */}
          <DemoBanner />
          <main className="px-4 pt-5 pb-8 lg:px-8 lg:pt-6 lg:pb-10">
            <div className="mb-4">
              <ServerStatus />
            </div>
            {/* key={pathname}: switching pages resets the boundary, so a crash on
                one page doesn't keep showing the error on the others. */}
            <ErrorBoundary key={location.pathname}>
              <Outlet />
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </div>
  );
}

// The provider wraps the layout, so the layout itself can read the sidebar state.
export default function AppLayout() {
  return (
    <SidebarProvider>
      <Layout />
    </SidebarProvider>
  );
}