import { useMemo, useState } from 'react';

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}/;

function compareValues(a, b) {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;

  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }

  const aStr = String(a);
  const bStr = String(b);

  if (ISO_DATE_RE.test(aStr) && ISO_DATE_RE.test(bStr)) {
    return new Date(aStr) - new Date(bStr);
  }

  const aNum = Number(aStr);
  const bNum = Number(bStr);
  if (!Number.isNaN(aNum) && !Number.isNaN(bNum) && aStr.trim() !== '' && bStr.trim() !== '') {
    return aNum - bNum;
  }

  return aStr.localeCompare(bStr, undefined, { sensitivity: 'base' });
}

/**
 * Client-side sort for an array of row objects. `toggleSort(key)` cycles
 * asc -> desc -> none (reverting to the original incoming order). Comparator
 * auto-detects number / ISO-date-string / plain string per column value.
 */
export function useSort(data, { defaultKey = null, defaultDir = null } = {}) {
  const [sortKey, setSortKey] = useState(defaultKey);
  const [sortDir, setSortDir] = useState(defaultDir);

  const toggleSort = (key) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir('asc');
      return;
    }
    if (sortDir === 'asc') {
      setSortDir('desc');
      return;
    }
    setSortKey(null);
    setSortDir(null);
  };

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return data;
    const copy = [...data];
    copy.sort((rowA, rowB) => {
      const result = compareValues(rowA[sortKey], rowB[sortKey]);
      return sortDir === 'asc' ? result : -result;
    });
    return copy;
  }, [data, sortKey, sortDir]);

  return { sorted, sortKey, sortDir, toggleSort };
}

export default useSort;
