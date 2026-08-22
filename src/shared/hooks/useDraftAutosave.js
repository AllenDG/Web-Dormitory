import { useEffect, useRef } from 'react';

/**
 * Debounced localStorage autosave for in-progress form drafts.
 * Pairs with readDraft/clearDraft below — this hook only writes.
 */
export function useDraftAutosave(storageKey, values, { enabled = true, debounceMs = 800 } = {}) {
  const timerRef = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(values));
      } catch {
        // Autosave is a convenience, not critical — ignore quota/availability errors.
      }
    }, debounceMs);

    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, JSON.stringify(values), enabled, debounceMs]);
}

export function readDraft(storageKey) {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearDraft(storageKey) {
  try {
    localStorage.removeItem(storageKey);
  } catch {
    // ignore
  }
}
