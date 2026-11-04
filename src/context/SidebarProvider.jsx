import { useMemo, useState } from 'react';
import { SidebarContext } from './SidebarContext.js';

// SIDEBAR: the open/closed state for the whole sidebar. Anything inside this
// provider (the layout, the links, the labels) can read it with useSidebar().
export function SidebarProvider({ children }) {
  // Desktop: is the compact sidebar expanded? (true while the mouse is over it,
  // or while a keyboard user has focus inside it.)
  const [open, setOpen] = useState(false);
  // Mobile: is the full-screen drawer open?
  const [drawerOpen, setDrawerOpen] = useState(false);

  // useMemo keeps the value stable, so readers re-render only when something changed.
  const value = useMemo(() => ({ open, setOpen, drawerOpen, setDrawerOpen }), [open, drawerOpen]);

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}