import { useCallback, useEffect, useRef, useState } from 'react';

// DROPDOWN: the open/close behavior shared by every popup in the app (status
// dropdown, row menu, profile menu, sort menu, filters panel), written once so
// they all behave the same:
//  - closes when you press outside it, or press Esc (focus returns to the button)
//  - when it opens, focus goes to the selected option (or the first control)
// Two modes:
//  menu: true  (default) a list of choices. Arrow keys move between them, and Tab
//              closes the menu.
//  menu: false a panel with several controls (the Filters panel). Tab moves
//              through the controls normally, and the panel closes when focus
//              leaves it.
export function useDropdown({ menu = true } = {}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null); // wraps the button AND the popup
  const buttonRef = useRef(null);
  const listRef = useRef(null);

  // WHY pointerdown and not onBlur: Safari doesn't focus a button when you click
  // it, so a blur handler would close the menu before the click lands.
  useEffect(() => {
    if (!open) return undefined;
    function handlePointerDown(event) {
      if (!wrapRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const list = listRef.current;
    (list?.querySelector('[aria-checked="true"]') ?? list?.querySelector('button'))?.focus();
  }, [open]);

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  }, []);

  function handleKeyDown(event) {
    if (!open) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (!menu) return;
    if (event.key === 'Tab') {
      setOpen(false); // let Tab move on normally
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const items = [...listRef.current.querySelectorAll('button')];
      const index = items.indexOf(document.activeElement);
      const step = event.key === 'ArrowDown' ? 1 : -1;
      items[(index + step + items.length) % items.length]?.focus();
    }
  }

  // Panel mode only: close when keyboard focus moves to something outside it.
  // relatedTarget is null when you click an empty spot, so that case is ignored
  // (the pointerdown handler above deals with clicks outside).
  function handleBlur(event) {
    if (menu || !open) return;
    if (event.relatedTarget && !wrapRef.current?.contains(event.relatedTarget)) setOpen(false);
  }

  return { open, setOpen, wrapRef, buttonRef, listRef, close, handleKeyDown, handleBlur };
}