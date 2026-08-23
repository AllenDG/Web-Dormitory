import { useRef, useState } from 'react';

const LONG_PRESS_MS = 500;
const TOUCH_MOVE_CANCEL_PX = 10;

/**
 * One instance per table/grid (not per row). Drives a right-click (desktop)
 * or long-press (touch) context menu from the same open state, so both
 * input modes land on identical behavior with no visible ellipsis trigger.
 */
export function useContextMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [activeItem, setActiveItem] = useState(null);
  const touchTimerRef = useRef(null);
  const touchStartRef = useRef(null);

  const open = (x, y, item) => {
    setPosition({ x, y });
    setActiveItem(item);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setActiveItem(null);
  };

  const clearTouchTimer = () => {
    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current);
      touchTimerRef.current = null;
    }
  };

  const onContextMenu = (event, item) => {
    event.preventDefault();
    open(event.clientX, event.clientY, item);
  };

  const onTouchStart = (event, item) => {
    const touch = event.touches[0];
    if (!touch) return;
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    clearTouchTimer();
    touchTimerRef.current = setTimeout(() => {
      open(touch.clientX, touch.clientY, item);
    }, LONG_PRESS_MS);
  };

  const onTouchMove = (event) => {
    const touch = event.touches[0];
    if (!touch || !touchStartRef.current) return;
    const dx = Math.abs(touch.clientX - touchStartRef.current.x);
    const dy = Math.abs(touch.clientY - touchStartRef.current.y);
    if (dx > TOUCH_MOVE_CANCEL_PX || dy > TOUCH_MOVE_CANCEL_PX) {
      clearTouchTimer();
    }
  };

  const onTouchEnd = () => {
    clearTouchTimer();
  };

  return {
    isOpen,
    position,
    activeItem,
    close,
    handlers: { onContextMenu, onTouchStart, onTouchMove, onTouchEnd },
  };
}

export default useContextMenu;
