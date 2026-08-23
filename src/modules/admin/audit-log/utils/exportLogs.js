const escapeCsvField = (value) => {
  const str = value == null ? '' : String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
};

/**
 * Client-side CSV export — no backend involved. Downloads directly via a
 * Blob URL, matching how ImageUploadField/other client-only exports work
 * elsewhere in this app.
 */
export const exportLogsToCsv = (logs) => {
  const headers = ['Timestamp', 'Actor', 'Action', 'Target', 'Details'];
  const rows = logs.map((l) => [
    l.timestamp,
    l.actorName || l.actorEmail || 'Unknown',
    l.action,
    l.target,
    l.details || '',
  ]);

  const csv = [headers, ...rows].map((row) => row.map(escapeCsvField).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
