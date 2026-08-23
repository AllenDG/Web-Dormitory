const escapeCsvField = (value) => {
  const str = value == null ? '' : String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
};

/**
 * Client-side CSV export — no backend involved. Same Blob-download
 * technique as src/modules/admin/audit-log/utils/exportLogs.js.
 */
export const exportTransactionsToCsv = (transactions) => {
  const headers = ['Date', 'Property', 'Type', 'Amount', 'Method', 'Reference', 'Status'];
  const rows = transactions.map((t) => [
    t.date,
    t.property,
    t.type,
    t.amount,
    t.method,
    t.reference,
    t.status,
  ]);

  const csv = [headers, ...rows].map((row) => row.map(escapeCsvField).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
