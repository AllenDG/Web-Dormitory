import { Box, SimpleGrid, Badge, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { FiEye, FiMail, FiUsers, FiUserCheck, FiDollarSign } from 'react-icons/fi';
import { useAuth } from '../../../../app/providers/AuthProvider';
import useBookingStore, { BOOKING_STATUS } from '../../../../shared/stores/useBookingStore';
import StatCard from '../../../../shared/components/StatCard';
import DataTable from '../../../../shared/components/DataTable';
import TableToolbar from '../../../../shared/components/TableToolbar';
import { TableSkeleton } from '../../../../shared/components/LoadingState';
import { useMinDisplayTime } from '../../../../shared/hooks/useMinDisplayTime';
import TenantDetailPanel from './TenantDetailPanel';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0 }).format(price);

const formatDate = (dateString) =>
  dateString ? new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

/**
 * Real tenant roster — one row per confirmed/completed booking (a tenant
 * with multiple leases over time correctly gets multiple rows, rather than
 * lossily de-duplicated by email).
 */
const TenantRosterTab = () => {
  const { user } = useAuth();
  const isLoading = useMinDisplayTime();
  const getBookingsByOwnerEmail = useBookingStore((state) => state.getBookingsByOwnerEmail);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const allTenantBookings = getBookingsByOwnerEmail(user?.email).filter(
    (b) => b.status === BOOKING_STATUS.CONFIRMED || b.status === BOOKING_STATUS.COMPLETED
  );
  const tenantBookings = allTenantBookings.filter(
    (b) =>
      !searchQuery ||
      b.guestName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.propertyTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = allTenantBookings.filter((b) => b.status === BOOKING_STATUS.CONFIRMED).length;
  const pastCount = allTenantBookings.filter((b) => b.status === BOOKING_STATUS.COMPLETED).length;
  const totalCollected = allTenantBookings.reduce((sum, b) => sum + (b.totalWithDeposit ?? b.totalAmount ?? 0), 0);

  const openDetail = (booking) => { setSelectedBooking(booking); onOpen(); };

  const columns = [
    { key: 'guestName', label: 'Tenant', sortable: true },
    { key: 'propertyTitle', label: 'Property', sortable: true },
    { key: 'checkIn', label: 'Lease Dates', sortable: true, render: (b) => `${formatDate(b.checkIn)} – ${formatDate(b.checkOut)}` },
    { key: 'totalAmount', label: 'Amount', sortable: true, render: (b) => formatPrice(b.totalWithDeposit ?? b.totalAmount) },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (b) => (
        <Badge colorScheme={b.status === BOOKING_STATUS.CONFIRMED ? 'green' : 'gray'}>
          {b.status === BOOKING_STATUS.CONFIRMED ? 'Active' : 'Completed'}
        </Badge>
      ),
    },
  ];

  const getRowActions = (booking) => [
    { label: 'View Tenant', icon: FiEye, onClick: () => openDetail(booking) },
    { label: 'Email Tenant', icon: FiMail, onClick: () => window.open(`mailto:${booking.guestEmail}`, '_self') },
  ];

  return (
    <Box>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={6}>
        <StatCard label="Active Tenants" value={activeCount} icon={FiUsers} color="success" />
        <StatCard label="Past Tenants" value={pastCount} icon={FiUserCheck} color="gray" />
        <StatCard label="Total Rent Collected" value={formatPrice(totalCollected)} icon={FiDollarSign} color="primary" />
      </SimpleGrid>

      <TableToolbar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by tenant name or property..."
        hasFilters={false}
      />

      {isLoading ? (
        <TableSkeleton rows={5} columns={5} />
      ) : (
        <DataTable
          columns={columns}
          data={tenantBookings}
          getRowKey={(b) => b.id}
          getRowActions={getRowActions}
          emptyState="No tenants yet — confirmed bookings will appear here."
        />
      )}

      <TenantDetailPanel isOpen={isOpen} onClose={onClose} booking={selectedBooking} />
    </Box>
  );
};

export default TenantRosterTab;
