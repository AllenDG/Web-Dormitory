import { Box, SimpleGrid, Heading, Text, useBreakpointValue } from '@chakra-ui/react';
import {
  FiHome,
  FiCalendar,
  FiDollarSign,
  FiTrendingUp,
  FiUsers,
  FiClock,
  FiStar,
  FiCheckCircle,
} from 'react-icons/fi';
import StatCard from '../../../shared/components/StatCard';
import PageBanner from '../../../shared/components/PageBanner';
import { StatCardSkeleton } from '../../../shared/components/LoadingState';
import { useMinDisplayTime } from '../../../shared/hooks/useMinDisplayTime';
import { useAuth } from '../../../app/providers/AuthProvider';
import useRentalStore from '../../../shared/stores/useRentalStore';
import useBookingStore from '../../../shared/stores/useBookingStore';
import useReviewStore from '../../../shared/stores/useReviewStore';
import GlobalSearch from '../../../domains/search/components/GlobalSearch';
import RevenueChart from './components/RevenueChart';
import OccupancyChart from './components/OccupancyChart';
import BookingsTimeline from './components/BookingsTimeline';
import PropertyPerformance from './components/PropertyPerformance';
import QuickActions from './components/QuickActions';
import { computeOwnerStats } from './utils/ownerAnalytics';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0 }).format(value);

/**
 * Owner Dashboard — real data derived from the owner's own properties and
 * bookings (no hardcoded mock stats). Quick Actions gets its own tinted
 * section so it doesn't read as another row of metrics.
 */
const DashboardPage = () => {
  const { user } = useAuth();
  const statsColumns = useBreakpointValue({ base: 1, md: 2, lg: 4 });
  const isLoading = useMinDisplayTime();

  const rentals = useRentalStore((state) => state.rentals) || [];
  const getBookingsByOwnerEmail = useBookingStore((state) => state.getBookingsByOwnerEmail);
  const propertyRatings = useReviewStore((state) => state.propertyRatings);

  const ownerProperties = rentals.filter((r) => r.ownerEmail === user?.email);
  const ownerBookings = getBookingsByOwnerEmail(user?.email);

  const stats = computeOwnerStats({ ownerProperties, ownerBookings, propertyRatings });

  return (
    <Box>
      <PageBanner title={`Welcome back, ${user?.name?.split(' ')[0] || 'Owner'}!`} subtitle="Here's what's happening with your properties today." />

      {/* Quick Actions — visually distinct band, not another stat row */}
      <Box bg="primary.50" borderRadius="lg" p={5} mb={8}>
        <Box mb={4}>
          <Heading size="sm" mb={1}>Quick Actions</Heading>
          <Text fontSize="xs" color="gray.600">Jump straight to a task, or search across your properties, bookings, and tenants</Text>
        </Box>
        <Box mb={4} maxW="360px">
          <GlobalSearch />
        </Box>
        <QuickActions />
      </Box>

      {isLoading ? (
        <SimpleGrid columns={statsColumns} spacing={6} mb={8}>
          <StatCardSkeleton count={8} />
        </SimpleGrid>
      ) : (
        <>
          <SimpleGrid columns={statsColumns} spacing={6} mb={6}>
            <StatCard label="Total Properties" value={stats.totalProperties} icon={FiHome} color="primary" helpText="Active listings" />
            <StatCard label="Active Bookings" value={stats.activeBookings} icon={FiCalendar} color="success" helpText="Approved, paid, or confirmed" />
            <StatCard label="Monthly Revenue" value={formatCurrency(stats.monthlyRevenue)} icon={FiDollarSign} color="warning" helpText="This calendar month" />
            <StatCard
              label="Occupancy Rate"
              value={`${stats.occupancyRate}%`}
              icon={FiTrendingUp}
              color="purple"
              helpText="Of all units"
              showProgress
              progressValue={stats.occupancyRate}
              progressMax={100}
            />
          </SimpleGrid>

          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6} mb={8}>
            <StatCard label="Total Tenants" value={stats.totalTenants} icon={FiUsers} color="info" helpText="Confirmed or completed leases" />
            <StatCard label="Pending Requests" value={stats.pendingRequests} icon={FiClock} color="primary" helpText="Awaiting your response" />
            <StatCard label="Avg. Rating" value={stats.avgRating ?? '—'} icon={FiStar} color="warning" helpText="Based on reviews" />
            <StatCard label="Completion Rate" value={stats.completionRate != null ? `${stats.completionRate}%` : '—'} icon={FiCheckCircle} color="success" helpText="Bookings completed" />
          </SimpleGrid>
        </>
      )}

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={8}>
        <RevenueChart bookings={ownerBookings} />
        <OccupancyChart properties={ownerProperties} bookings={ownerBookings} />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        <BookingsTimeline bookings={ownerBookings} />
        <PropertyPerformance properties={ownerProperties} bookings={ownerBookings} propertyRatings={propertyRatings} />
      </SimpleGrid>
    </Box>
  );
};

export default DashboardPage;
