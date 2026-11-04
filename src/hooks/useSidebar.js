import { useContext } from 'react';
import { SidebarContext, SidebarModeContext } from '../context/SidebarContext.js';

// SIDEBAR: the one hook the sidebar parts use.
// showLabels is the rule for text labels: in the mobile drawer they are always
// shown, in the desktop sidebar only while it is expanded.
export function useSidebar() {
  const context = useContext(SidebarContext);
  const mode = useContext(SidebarModeContext);
  if (context === null) throw new Error('useSidebar must be used inside <SidebarProvider>.');
  return { ...context, mode, showLabels: mode === 'mobile' || context.open };
}