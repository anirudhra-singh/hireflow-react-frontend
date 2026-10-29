// app layout
import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import DemoBanner from './DemoBanner.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';
import ServerStatus from './ServerStatus.jsx';
import Icon from './Icon.jsx';
import { secondaryButton } from '../utils/ui.js';

const NAV_ITEMS = [
  { to: '/', label: 'Board', icon: 'board', end: true },
  { to: '/timeline', label: 'Timeline', icon: 'timeline', end: false },
  { to: '/analytics', label: 'Analytics', icon: 'analytics', end: false },
];

function Brand() {
  return (
    <span className="flex items-center gap-2 text-lg font-bold">
      <span className="grid size-7 place-items-center rounded-lg bg-violet-700 text-sm text-white" aria-hidden="true">
        H
      </span>
      HireFlow
    </span>
  );
}

const sideLink = ({ isActive }) =>
  `flex min-h-11 items-center gap-3 rounded-xl px-3 text-[15px] font-medium ${
    isActive ? 'bg-violet-50 text-violet-800' : 'text-gray-600 hover:bg-gray-50'
  }`;

const tabLink = ({ isActive }) =>
  `flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs font-medium ${
    isActive ? 'text-violet-800' : 'text-gray-600'
  }`;

export default function AppLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true); 
    await logout(); 
  }

  return (
    <div className="min-h-dvh">
      <DemoBanner />

      <div className={`lg:grid ${sidebarOpen ? 'lg:grid-cols-[14.5rem_1fr]' : 'lg:grid-cols-1'}`}>
        <aside
          className={`${
            sidebarOpen ? 'hidden lg:flex' : 'hidden'
          } sticky top-0 h-dvh flex-col gap-6 self-start border-r border-gray-200 bg-white px-3 py-5`}
        >
          <div className="px-2">
            <Brand />
          </div>
          <nav aria-label="Main" className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={sideLink}>
                <Icon name={item.icon} />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-2 border-t border-gray-200 px-2 pt-4">
            <span className="truncate text-sm text-gray-700">{user.full_name}</span>
            <button type="button" className={secondaryButton} onClick={handleLogout} disabled={loggingOut}>
              {loggingOut ? 'Signing out…' : 'Log out'}
            </button>
          </div>
        </aside>

        <div className="min-w-0">
          {/* mobile top bar*/}
          <header className="sticky top-0 z-20 border-b border-gray-200 bg-white px-4 py-3 lg:hidden">
            <Brand />
          </header>

          {/* desktop-only toggle*/}
          <div className="hidden px-8 pt-3 lg:block">
            <button
              type="button"
              className={secondaryButton}
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen((open) => !open)}
            >
              <Icon name="sidebar" />
              {sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
            </button>
          </div>

          {/* mobile tab bar never covers content */}
          <main className="px-4 pb-24 pt-5 lg:px-8 lg:pb-10 lg:pt-4">
            <div className="mb-4">
              <ServerStatus />
            </div>
            <ErrorBoundary key={location.pathname}>
              <Outlet />
            </ErrorBoundary>
          </main>
        </div>
      </div>

      {/* mobile bottom tab bar respects iphone home indicator. */}
      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={tabLink}>
            <Icon name={item.icon} />
            {item.label}
          </NavLink>
        ))}
        <button type="button" onClick={handleLogout} disabled={loggingOut} className={`${tabLink({ isActive: false })} disabled:opacity-60`}>
          {loggingOut ? 'Signing out…' : 'Log out'}
        </button>
      </nav>
    </div>
  );
}