import { useContext, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import Icon from './Icon.jsx';
import { SidebarModeContext } from '../context/SidebarContext.js';
import { useSidebar } from '../hooks/useSidebar.js';


export function SidebarLabel({ children, className = '' }) {
  const { showLabels } = useSidebar();
  return (
    <span
      className={`whitespace-nowrap transition-[opacity,visibility,transform] duration-200 ${
        showLabels ? 'visible opacity-100 delay-75' : 'invisible opacity-0'
      } ${className}`}
    >
      {children}
    </span>
  );
}

// brand
export function SidebarBrand() {
  return (
    <div className="flex items-center gap-2.5 text-lg font-bold whitespace-nowrap text-neutral-900 dark:text-neutral-50">
      <span
        className="grid size-8 shrink-0 place-items-center rounded-[9px] bg-violet-700 text-[15px] text-white"
        aria-hidden="true"
      >
        H
      </span>
      <SidebarLabel>HireFlow</SidebarLabel>
    </div>
  );
}

//link

export function SidebarLink({ icon, label, to, end, onClick, disabled }) {
  const { setDrawerOpen, mode } = useSidebar();

 
  const size = mode === 'mobile' ? 'h-13 px-3.5 text-lg' : 'h-10 px-[7px] text-[15px]';
  // group + group-hover:translate-x-1 on the label = the small nudge to the right on hover.
  const base = `group flex w-full items-center gap-3 rounded-xl font-medium transition-colors duration-150 ${size}`;
  const idle = 'text-neutral-600 hover:bg-neutral-200 dark:text-neutral-300 dark:hover:bg-neutral-700';
  const active = 'bg-violet-100 text-violet-800 dark:bg-violet-500/20 dark:text-violet-200';

  // Any click closes the mobile drawer (harmless on desktop).
  function handleClick() {
    setDrawerOpen(false);
    if (onClick) onClick();
  }

  const content = (
    <>
      <Icon name={icon} className="size-4.5 shrink-0" />
      <SidebarLabel className="group-hover:translate-x-1">{label}</SidebarLabel>
    </>
  );

  if (to) {
    return (
      <NavLink
        to={to}
        end={end}
        aria-label={label}
        onClick={handleClick}
        className={({ isActive }) => `${base} ${isActive ? active : idle}`}
      >
        {content}
      </NavLink>
    );
  }
  return (
    <button type="button" aria-label={label} disabled={disabled} onClick={handleClick} className={`${base} ${idle} disabled:opacity-60`}>
      {content}
    </button>
  );
}

// ---------------------------------------------------------------- desktop
// SIDEBAR (desktop): a sticky, full-height column. The grid in AppLayout gives it
// 60px or 280px, and the <aside> fills that column. Because the COLUMN changes
// width, the page content is pushed to the right (it is never covered).
function DesktopSidebar({ children }) {
  const { setOpen } = useSidebar();

  // Keyboard users: tabbing into the sidebar expands it, tabbing out collapses it.
  function handleBlur(event) {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  }

  return (
    <div className="sticky top-0 hidden h-dvh self-start lg:block">
      <aside
        aria-label="Sidebar"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={handleBlur}
        // overflow-y-auto: on a very short window the sidebar scrolls inside
        // itself instead of cutting off the Account / Log out part at the bottom.
        className="absolute inset-0 flex flex-col gap-5 overflow-x-hidden overflow-y-auto border-r border-neutral-200 bg-neutral-100 px-3.25 py-4 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
      >
        {children}
      </aside>
    </div>
  );
}

// ---------------------------------------------------------------- mobile
// SIDEBAR (mobile): a top bar with a hamburger, and a full-screen drawer that
// slides in from the left (-translate-x-full -> translate-x-0).
function MobileSidebar({ children }) {
  const { drawerOpen, setDrawerOpen } = useSidebar();
  const openButtonRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!drawerOpen) return undefined;
    // Stop the page behind the drawer from scrolling, move focus into the
    // drawer, and let Esc close it (focus goes back to the hamburger).
    document.body.classList.add('overflow-hidden');
    closeButtonRef.current?.focus();
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setDrawerOpen(false);
        openButtonRef.current?.focus();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.classList.remove('overflow-hidden');
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [drawerOpen, setDrawerOpen]);

  const iconButton =
    'grid size-11 place-items-center rounded-xl text-neutral-700 transition-colors duration-150 hover:bg-neutral-200 dark:text-neutral-200 dark:hover:bg-neutral-700';

  return (
    <>
      {/* The top bar: sticks to the top of the screen while you scroll. lg:hidden = phones and tablets only. */}
      <header className="sticky top-0 z-20 flex items-center gap-1 border-b border-neutral-200 bg-neutral-100 px-3 py-2 lg:hidden dark:border-neutral-700 dark:bg-neutral-800">
        <button
          ref={openButtonRef}
          type="button"
          aria-label="Open menu"
          aria-expanded={drawerOpen}
          aria-controls="mobile-drawer"
          onClick={() => setDrawerOpen(true)}
          className={iconButton}
        >
          <Icon name="menu" className="size-5" />
        </button>
        <SidebarBrand />
      </header>

      {/* The drawer. While closed it is invisible AND inert, so Tab can't reach
          the links hidden off-screen. */}
      <div
        id="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        inert={!drawerOpen}
        className={`fixed inset-0 z-60 flex flex-col gap-4 overflow-y-auto bg-neutral-100 p-4 transition-[transform,visibility] duration-300 ease-out lg:hidden dark:bg-neutral-800 dark:text-neutral-100 ${
          drawerOpen ? 'visible translate-x-0' : 'invisible -translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between">
          <SidebarBrand />
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close menu"
            onClick={() => {
              setDrawerOpen(false);
              openButtonRef.current?.focus();
            }}
            className={iconButton}
          >
            <Icon name="close" className="size-5" />
          </button>
        </div>
        {children}
      </div>
    </>
  );
}

// ---------------------------------------------------------------- body
// SIDEBAR: put your brand, links and account block inside <SidebarBody>. It draws
// them in BOTH the desktop sidebar and the mobile drawer (only one is visible at
// a time, chosen by the lg: breakpoint), so you write the menu once.
export function SidebarBody({ children }) {
  return (
    <>
      <SidebarModeContext.Provider value="desktop">
        <DesktopSidebar>{children}</DesktopSidebar>
      </SidebarModeContext.Provider>
      <SidebarModeContext.Provider value="mobile">
        <MobileSidebar>{children}</MobileSidebar>
      </SidebarModeContext.Provider>
    </>
  );
}

// Used by AppLayout to read the mode if it ever needs it.
export function useSidebarMode() {
  return useContext(SidebarModeContext);
}