import { createContext } from 'react';

// SIDEBAR: two contexts live here.
//  SidebarContext     = the shared state (is the sidebar expanded, is the mobile
//                       drawer open). One provider at the top, many readers.
//  SidebarModeContext = tells a link whether it is drawn in the desktop sidebar or
//                       in the mobile drawer. The same links are rendered in both
//                       places, and labels behave differently in each.
export const SidebarContext = createContext(null);
export const SidebarModeContext = createContext('desktop');