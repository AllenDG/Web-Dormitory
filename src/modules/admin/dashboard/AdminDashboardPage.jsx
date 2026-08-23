import { Box, SimpleGrid } from '@chakra-ui/react';
import PageBanner from '../../../shared/components/PageBanner';
import { StatCardSkeleton } from '../../../shared/components/LoadingState';
import { useMinDisplayTime } from '../../../shared/hooks/useMinDisplayTime';
import { useAuth } from '../../../app/providers/AuthProvider';
import useAdminStore from '../../../shared/stores/useAdminStore';
import useRentalStore from '../../../shared/stores/useRentalStore';
import useBookingStore from '../../../shared/stores/useBookingStore';
import PlatformStats from './components/PlatformStats';
import AnalyticsCharts from './components/AnalyticsCharts';
import { computeAdminStats } from './utils/adminAnalytics';

/**
 * Admin Dashboard — replaces AdminDashboardEnhanced.jsx. The old internal
 * Tabs (User Management / Property Moderation / Reported Issues / Settings)
 * are now real routes under the admin sidebar, so this page is just the
 * overview: platform stats + analytics.
 */
const AdminDashboardPage = () => {
  const { user } = useAuth();
  const isLoading = useMinDisplayTime();

  const users = useAdminStore((state) => state.users);
  const reports = useAdminStore((state) => state.reports);
  const rentals = useRentalStore((state) => state.rentals);
  const bookings = useBookingStore((state) => state.bookings);

  const stats = computeAdminStats({ users, rentals, bookings, reports });

  return (
    <Box>
      <PageBanner title={`Welcome back, ${user?.name?.split(' ')[0] || 'Admin'}`} subtitle="Platform-wide overview" />

      <Box mb={8}>
        {isLoading ? (
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={6}>
            <StatCardSkeleton count={4} />
          </SimpleGrid>
        ) : (
          <PlatformStats stats={stats} />
        )}
      </Box>

      <AnalyticsCharts users={users} rentals={rentals} bookings={bookings} stats={stats} />
    </Box>
  );
};

export default AdminDashboardPage;
