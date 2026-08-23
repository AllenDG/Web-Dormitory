import { useEffect, useState } from 'react';

/**
 * Shows `true` for a fixed minimum duration on mount, then flips to `false`.
 * This app has no real async fetch (Zustand + localStorage reads are
 * synchronous), so skeleton loading states can't be driven by real network
 * latency — this gives a short, honest, non-flickering skeleton window
 * instead of either an instant flash or a fake infinite spinner.
 */
export function useMinDisplayTime(minMs = 400) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), minMs);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isLoading;
}

export default useMinDisplayTime;
