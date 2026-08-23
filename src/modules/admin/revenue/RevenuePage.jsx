import { useState } from 'react';
import { Box, SimpleGrid, Badge, Input, InputGroup, InputLeftElement, Icon, HStack, VStack, Select } from '@chakra-ui/react';
import { FiDollarSign, FiTrendingUp, FiActivity, FiHash, FiSearch } from 'react-icons/fi';
import useBookingStore, { BOOKING_STATUS } from '../../../shared/stores/useBookingStore';
import PageBanner from '../../../shared/components/PageBanner';
import StatCard from '../../../shared/components/StatCard';
import DataTable from '../../../shared/components/DataTable';
import { StatCardSkeleton, TableSkeleton } from '../../../shared/components/LoadingState';
import { useMinDisplayTime } from '../../../shared/hooks/useMinDisplayTime';

const REVENUE_STATUSES = [BOOKING_STATUS.PAID, BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.COMPLETED];

const formatPrice = (price) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0 }).format(price);

const formatDate = (dateString) =>
  dateString ? new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

const STATUS_COLORS = { paid: 'blue', confirmed: 'green', completed: 'gray' };

/**
 * Revenue overview — platform-wide, derived from real booking data (same
 * aggregation approach as the owner's TransactionHistoryPage, generalized
 * to every owner instead of just the logged-in one).
 */
const RevenuePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const bookings = useBookingStore((state) => state.bookings);
  const isLoading = useMinDisplayTime();

  const revenueBookings = bookings
    .filter((b) => REVENUE_STATUSES.includes(b.status))
    .filter((b) => {
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
  const totalRevenue = revenueBookings.reduce((sum, b) => sum + (b.totalWithDeposit ?? b.totalAmount ?? 0), 0);

  const now = new Date();
  const thisMonthRevenue = revenueBookings
    .filter((b) => {
      const d = new Date(b.paidAt || b.paymentVerifiedAt || b.updatedAt);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    })
    .reduce((sum, b) => sum + (b.totalWithDeposit ?? b.totalAmount ?? 0), 0);

  const avgBookingValue = revenueBookings.length > 0 ? totalRevenue / revenueBookings.length : 0;

  const columns = [
    { key: 'paidAt', label: 'Date', sortable: true, render: (b) => formatDate(b.paidAt || b.paymentVerifiedAt || b.updatedAt) },
    { key: 'propertyTitle', label: 'Property', sortable: true },
    { key: 'ownerName', label: 'Owner', sortable: true },
    { key: 'guestName', label: 'Tenant', sortable: true },
    { key: 'totalAmount', label: 'Amount', sortable: true, render: (b) => formatPrice(b.totalWithDeposit ?? b.totalAmount) },
    { key: 'status', label: 'Status', sortable: true, render: (b) => <Badge colorScheme={STATUS_COLORS[b.status] || 'gray'} borderRadius="md">{b.status}</Badge> },
  ];

  return (
    <Box>
      <PageBanner title="Revenue" subtitle="Platform-wide transaction overview" />

      <InputGroup mb={6} w="full">
        <InputLeftElement pointerEvents="none"><Icon as={FiSearch} color="gray.400" /></InputLeftElement>
        <Input placeholder="Search by property, owner, or tenant..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </InputGroup>

      <VStack align="stretch" spacing={4} mb={6}>
        <HStack spacing={4}>
          <Select maxW="150px" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
          </Select>
        </HStack>
        <HStack spacing={4}>
          <Input
            type="date"
            placeholder="From"
            maxW="150px"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <Input
            type="date"
            placeholder="To"
            maxW="150px"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </HStack>
      </VStack>

      {isLoading ? (
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
      )}

      {isLoading ? (
        <TableSkeleton rows={6} columns={6} />
      ) : (
        <DataTable
          columns={columns}
          data={revenueBookings}
          getRowKey={(b) => b.id}
          emptyState="No transactions yet."
        />
      )}
    </Box>
  );
};

export default RevenuePage;
