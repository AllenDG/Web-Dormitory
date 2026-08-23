import { Box, Badge, SimpleGrid, Flex, Select, Icon } from '@chakra-ui/react';
import {
  FiDownload,
  FiCalendar,
  FiDollarSign,
  FiCheckCircle,
  FiClock,
} from 'react-icons/fi';
import { useState } from 'react';
import { format } from 'date-fns';
import useBookingStore from '../../../shared/stores/useBookingStore';
import { useAuth } from '../../../app/providers/AuthProvider';
import { useAppToast } from '../../../shared/hooks/useAppToast';
import PageBanner from '../../../shared/components/PageBanner';
import Button from '../../../shared/components/Button';
import StatCard from '../../../shared/components/StatCard';
import DataTable from '../../../shared/components/DataTable';
import TableToolbar from '../../../shared/components/TableToolbar';
import { exportTransactionsToCsv } from '../utils/exportTransactions';

const STATUS_COLORS = { completed: 'success', pending: 'warning', failed: 'error', refunded: 'info' };

const formatPrice = (price) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0 }).format(price);

const matchesPeriod = (dateStr, period) => {
  if (period === 'all') return true;
  const d = new Date(dateStr);
  const now = new Date();
  if (period === 'today') return d.toDateString() === now.toDateString();
  if (period === 'week') {
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);
    return d >= weekAgo;
  }
  if (period === 'month') return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  if (period === 'year') return d.getFullYear() === now.getFullYear();
  return true;
};

/** Owner-facing transaction ledger — every completed/pending/failed/refunded booking payment tied to the owner's properties. */
const TransactionHistoryPage = () => {
  const toast = useAppToast();
  const { user } = useAuth();
  const bookings = useBookingStore((state) => state.bookings);
  const [searchQuery, setSearchQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('all');

  const relevantBookings = bookings.filter((booking) => booking.ownerEmail === user?.email);

  const transactions = relevantBookings.map((booking) => ({
    id: booking.id,
    property: booking.propertyTitle || 'Untitled Property',
    type: 'Rental Booking Payment',
    amount: booking.totalWithDeposit ?? booking.totalAmount ?? 0,
    date: booking.paidAt || booking.createdAt,
    method: booking.paymentMethod || '—',
    reference: booking.transactionId || booking.id,
    status: booking.paymentStatus,
  }));

  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch =
      !searchQuery ||
      txn.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.reference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || txn.status === filterStatus;
    return matchesSearch && matchesStatus && matchesPeriod(txn.date, filterPeriod);
  });

  const stats = {
    total: transactions.length,
    completed: transactions.filter((t) => t.status === 'completed').length,
    pending: transactions.filter((t) => t.status === 'pending').length,
    totalAmount: transactions.filter((t) => t.status === 'completed').reduce((sum, t) => sum + t.amount, 0),
  };

  const handleExport = () => {
    if (filteredTransactions.length === 0) {
      toast({ title: 'Nothing to export', status: 'warning' });
      return;
    }
    exportTransactionsToCsv(filteredTransactions);
    toast({ title: 'Export Started', description: `${filteredTransactions.length} transactions exported.`, status: 'success' });
  };

  const columns = [
    { key: 'date', label: 'Date', sortable: true, render: (t) => format(new Date(t.date), 'MMM d, yyyy') },
    { key: 'property', label: 'Property', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true, render: (t) => formatPrice(t.amount) },
    { key: 'method', label: 'Method', sortable: true },
    { key: 'reference', label: 'Reference', render: (t) => t.reference },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (t) => <Badge colorScheme={STATUS_COLORS[t.status] || 'gray'} borderRadius="md">{t.status}</Badge>,
    },
  ];

  return (
    <Box>
      <PageBanner
        title="Payments"
        subtitle="Every payment received across your properties"
        actions={
          <Button leftIcon={<Icon as={FiDownload} />} variant="outline" onClick={handleExport} isDisabled={filteredTransactions.length === 0}>
            Export CSV
          </Button>
        }
      />

      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={6} mb={8}>
        <StatCard label="Total Transactions" value={stats.total} icon={FiCalendar} color="primary" />
        <StatCard label="Completed" value={stats.completed} icon={FiCheckCircle} color="success" />
        <StatCard label="Pending" value={stats.pending} icon={FiClock} color="warning" />
        <StatCard label="Total Received" value={formatPrice(stats.totalAmount)} icon={FiDollarSign} color="info" />
      </SimpleGrid>

      <TableToolbar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by property or reference number..."
        filtersOpen={filtersOpen}
        onToggleFilters={() => setFiltersOpen((prev) => !prev)}
      >
        <Flex wrap="wrap" gap={4}>
          <Select flex="1" minW={{ base: '100%', sm: '160px' }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </Select>
          <Select flex="1" minW={{ base: '100%', sm: '160px' }} value={filterPeriod} onChange={(e) => setFilterPeriod(e.target.value)}>
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </Select>
        </Flex>
      </TableToolbar>

      <DataTable
        columns={columns}
        data={filteredTransactions}
        getRowKey={(t) => t.id}
        emptyState="No transactions match your search or filters."
      />
    </Box>
  );
};

export default TransactionHistoryPage;
