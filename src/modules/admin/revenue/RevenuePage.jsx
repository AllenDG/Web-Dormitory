import { useState } from 'react';
import { Box, SimpleGrid, Badge, Input, InputGroup, InputLeftElement, Icon, Flex, Select, useDisclosure } from '@chakra-ui/react';
import { FiDollarSign, FiTrendingUp, FiActivity, FiHash, FiSearch, FiRefreshCw } from 'react-icons/fi';
import useBookingStore, { BOOKING_STATUS, PAYMENT_STATUS } from '../../../shared/stores/useBookingStore';
import PageBanner from '../../../shared/components/PageBanner';
import StatCard from '../../../shared/components/StatCard';
import DataTable from '../../../shared/components/DataTable';
import { StatCardSkeleton, TableSkeleton } from '../../../shared/components/LoadingState';
import { useMinDisplayTime } from '../../../shared/hooks/useMinDisplayTime';
import RefundPanel from './components/RefundPanel';

const REVENUE_STATUSES = [BOOKING_STATUS.PAID, BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.COMPLETED];
const REFUND_ELIGIBLE_STATUSES = [BOOKING_STATUS.PAID, BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.CANCELLED];

const formatPrice = (price) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0 }).format(price);

const formatDate = (dateString) =>
  dateString ? new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

const STATUS_COLORS = { paid: 'blue', confirmed: 'green', completed: 'gray', pending: 'yellow', approved: 'blue', rejected: 'red', cancelled: 'red' };
const VIEW_TITLES = { overview: 'Revenue', transactions: 'Transactions', refunds: 'Refunds & Disputes' };
const VIEW_SUBTITLES = {
  overview: 'Platform-wide transaction overview',
  transactions: 'Full booking ledger, every status',
  refunds: 'Bookings eligible for refund',
};

/**
 * Revenue — platform-wide, derived from real booking data (same
 * aggregation approach as the owner's TransactionHistoryPage, generalized
 * to every owner instead of just the logged-in one). Three routed views:
 * Overview (paid/confirmed/completed only, with stat cards), Transactions
 * (every booking regardless of status — full ledger), and Refunds &
 * Disputes (refund-eligible bookings, row action opens RefundPanel — the
 * bypass tier for this section, since no refund action existed anywhere
 * before this round).
 */
const RevenuePage = ({ view = 'overview' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const bookings = useBookingStore((state) => state.bookings);
  const isLoading = useMinDisplayTime();
  const { isOpen: isRefundOpen, onOpen: openRefund, onClose: closeRefund } = useDisclosure();

  const baseBookings =
    view === 'transactions' ? bookings :
    view === 'refunds' ? bookings.filter((b) => REFUND_ELIGIBLE_STATUSES.includes(b.status) && b.paymentStatus !== PAYMENT_STATUS.REFUNDED) :
    bookings.filter((b) => REVENUE_STATUSES.includes(b.status));

  const filteredBookings = baseBookings.filter((b) => {
    const matchesSearch =
      !searchQuery ||
      b.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.guestName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const bookingDate = new Date(b.paidAt || b.paymentVerifiedAt || b.updatedAt);
    const fromDate = dateFrom ? new Date(dateFrom) : null;
    const toDate = dateTo ? new Date(dateTo) : null;
    const matchesDateRange = (!fromDate || bookingDate >= fromDate) && (!toDate || bookingDate <= toDate);
    return matchesSearch && matchesStatus && matchesDateRange;
  });

  const revenueBookings = bookings.filter((b) => REVENUE_STATUSES.includes(b.status));
  const totalRevenue = revenueBookings.reduce((sum, b) => sum + (b.totalWithDeposit ?? b.totalAmount ?? 0), 0);

  const now = new Date();
  const thisMonthRevenue = revenueBookings
    .filter((b) => {
      const d = new Date(b.paidAt || b.paymentVerifiedAt || b.updatedAt);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    })
    .reduce((sum, b) => sum + (b.totalWithDeposit ?? b.totalAmount ?? 0), 0);

  const avgBookingValue = revenueBookings.length > 0 ? totalRevenue / revenueBookings.length : 0;

  const handleOpenRefund = (booking) => {
    setSelectedBooking(booking);
    openRefund();
  };

  const columns = [
    { key: 'paidAt', label: 'Date', sortable: true, render: (b) => formatDate(b.paidAt || b.paymentVerifiedAt || b.updatedAt) },
    { key: 'propertyTitle', label: 'Property', sortable: true },
    { key: 'ownerName', label: 'Owner', sortable: true },
    { key: 'guestName', label: 'Tenant', sortable: true },
    { key: 'totalAmount', label: 'Amount', sortable: true, render: (b) => formatPrice(b.totalWithDeposit ?? b.totalAmount) },
    { key: 'status', label: 'Status', sortable: true, render: (b) => <Badge colorScheme={STATUS_COLORS[b.status] || 'gray'} borderRadius="md">{b.status}</Badge> },
  ];

  const getRowActions =
    view === 'refunds'
      ? (booking) => [{ label: 'Issue Refund', icon: FiRefreshCw, isDestructive: true, onClick: () => handleOpenRefund(booking) }]
      : undefined;

  return (
    <Box>
      <PageBanner title={VIEW_TITLES[view]} subtitle={VIEW_SUBTITLES[view]} />

      <InputGroup mb={4} w="full">
        <InputLeftElement pointerEvents="none"><Icon as={FiSearch} color="gray.500" /></InputLeftElement>
        <Input placeholder="Search by property, owner, or tenant..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </InputGroup>

      <Flex wrap="wrap" gap={4} mb={6}>
        <Select flex="1" minW={{ base: '100%', sm: '160px' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="paid">Paid</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="rejected">Rejected</option>
        </Select>
        <Input
          type="date"
          aria-label="From date"
          flex="1"
          minW={{ base: '100%', sm: '150px' }}
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
        />
        <Input
          type="date"
          aria-label="To date"
          flex="1"
          minW={{ base: '100%', sm: '150px' }}
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
        />
      </Flex>

      {view === 'overview' && (
        isLoading ? (
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={8}>
            <StatCardSkeleton count={4} />
          </SimpleGrid>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={8}>
            <StatCard label="Total Platform Revenue" value={formatPrice(totalRevenue)} icon={FiDollarSign} color="primary" />
            <StatCard label="This Month" value={formatPrice(thisMonthRevenue)} icon={FiTrendingUp} color="success" />
            <StatCard label="Avg. Booking Value" value={formatPrice(Math.round(avgBookingValue))} icon={FiActivity} color="warning" />
            <StatCard label="Total Transactions" value={revenueBookings.length} icon={FiHash} color="info" />
          </SimpleGrid>
        )
      )}

      {isLoading ? (
        <TableSkeleton rows={6} columns={6} />
      ) : (
        <DataTable
          columns={columns}
          data={filteredBookings}
          getRowKey={(b) => b.id}
          getRowActions={getRowActions}
          emptyState={view === 'refunds' ? 'No refund-eligible bookings.' : 'No transactions yet.'}
        />
      )}

      <RefundPanel booking={selectedBooking} isOpen={isRefundOpen} onClose={closeRefund} />
    </Box>
  );
};

export default RevenuePage;
