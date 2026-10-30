import { useEffect, useState } from 'react';

const EDGE = 90; // px from the window edge where auto-scroll starts
const MAX_SPEED = 22; // px scrolled per frame at the very edge

// deeper the pointer is inside the edge zone the faster we scroll
function speed(depth) {
  return Math.max(1, Math.round((Math.min(depth, EDGE) / EDGE) * MAX_SPEED));
}

export function useDragAutoScroll(boardRef) {
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    let frame = 0;
    let pointer = null; 
    let overDock = false;
    let active = false;

    function tick() {
      if (!active) return;
      if (pointer) {
        const { x, y } = pointer;
        const bottomZone = window.innerHeight - EDGE;
        if (!overDock) {
          if (y < EDGE) window.scrollBy(0, -speed(EDGE - y));
          else if (y > bottomZone) window.scrollBy(0, speed(y - bottomZone));
        }

        const board = boardRef.current;
        if (board) {
          const rect = board.getBoundingClientRect();
          if (x < rect.left + EDGE) board.scrollLeft -= speed(rect.left + EDGE - x);
          else if (x > rect.right - EDGE) board.scrollLeft += speed(x - (rect.right - EDGE));
        }
      }
      frame = requestAnimationFrame(tick);
    }

    function start(event) {
      if (!event.target.closest?.('[draggable="true"]')) return;
      active = true;
      setDragging(true);
      frame = requestAnimationFrame(tick);
    }

    function track(event) {
      if (!active) return;
      pointer = { x: event.clientX, y: event.clientY };
      overDock = Boolean(event.target.closest?.('[data-drag-dock]'));
    }

    function stop() {
      active = false;
      pointer = null;
      overDock = false;
      cancelAnimationFrame(frame);
      setDragging(false);
    }

    window.addEventListener('dragstart', start);
    window.addEventListener('dragover', track);
    window.addEventListener('dragend', stop);
    window.addEventListener('drop', stop);
    return () => {
      window.removeEventListener('dragstart', start);
      window.removeEventListener('dragover', track);
      window.removeEventListener('dragend', stop);
      window.removeEventListener('drop', stop);
      stop();
    };
  }, [boardRef]);

  return dragging;
}