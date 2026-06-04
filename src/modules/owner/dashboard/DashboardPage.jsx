import {
  Box,
  SimpleGrid,
  Heading,
  Text,
  VStack,
  Container,
  useBreakpointValue,
} from '@chakra-ui/react';
import {
  FiHome,
  FiCalendar,
  FiDollarSign,
  FiTrendingUp,
  FiUsers,
  FiEye,
  FiStar,
  FiCheckCircle,
} from 'react-icons/fi';
import StatCard from './components/StatCard';
import RevenueChart from './components/RevenueChart';
import OccupancyChart from './components/OccupancyChart';
import BookingsTimeline from './components/BookingsTimeline';
import PropertyPerformance from './components/PropertyPerformance';
import QuickActions from './components/QuickActions';

/**
 * Enhanced Owner Dashboard Page
 * Comprehensive overview with charts, metrics, and analytics
 * Week 13 - Owner Portal Enhancement
 */

const DashboardPage = () => {
  // Responsive grid columns
  const statsColumns = useBreakpointValue({ base: 1, md: 2, lg: 4 });
  const chartsColumns = useBreakpointValue({ base: 1, lg: 2 });

  // Mock data - replace with actual API calls
  const stats = {
    totalProperties: {
      value: 5,
      trend: 'up',
      trendValue: '+2',
      helpText: 'Active listings',
    },
    activeBookings: {
      value: 12,
      trend: 'up',
      trendValue: '+15%',
      helpText: 'This month',
    },
    monthlyRevenue: {
      value: '₱48,000',
      trend: 'up',
      trendValue: '+12%',
      helpText: 'vs. last month',
    },
    occupancyRate: {
      value: '85%',
      trend: 'up',
      trendValue: '+5%',
      helpText: 'All properties',
      showProgress: true,
      progressValue: 42,
      progressMax: 50,
    },
    totalTenants: {
      value: 28,
      trend: 'neutral',
      trendValue: '0%',
      helpText: 'Active tenants',
    },
    propertyViews: {
      value: '1,234',
      trend: 'up',
      trendValue: '+23%',
      helpText: 'This month',
    },
    avgRating: {
      value: '4.7',
      trend: 'up',
      trendValue: '+0.2',
      helpText: 'Based on reviews',
    },
    completionRate: {
      value: '94%',
      trend: 'up',
      trendValue: '+3%',
      helpText: 'Booking completion',
    },
  };

  return (
    <Box bg="gray.50" minH="100vh" pb={8}>
      <Container maxW="container.xl" py={8}>
        {/* Page Header */}
        <VStack align="start" spacing={6} mb={8}>
          <Box>
            <Heading size="lg" mb={2}>
              Dashboard Overview
            </Heading>
            <Text color="gray.600">
              Welcome back! Here's what's happening with your properties today.
            </Text>
          </Box>

          {/* Quick Actions */}
          <Box w="full">
            <QuickActions />
          </Box>
        </VStack>

        {/* Main Stats Grid */}
        <SimpleGrid columns={statsColumns} spacing={6} mb={8}>
          <StatCard
            label="Total Properties"
            value={stats.totalProperties.value}
            icon={FiHome}
            color="primary"
            trend={stats.totalProperties.trend}
            trendValue={stats.totalProperties.trendValue}
            helpText={stats.totalProperties.helpText}
          />
          <StatCard
            label="Active Bookings"
            value={stats.activeBookings.value}
            icon={FiCalendar}
            color="success"
            trend={stats.activeBookings.trend}
            trendValue={stats.activeBookings.trendValue}
            helpText={stats.activeBookings.helpText}
          />
          <StatCard
            label="Monthly Revenue"
            value={stats.monthlyRevenue.value}
            icon={FiDollarSign}
            color="warning"
            trend={stats.monthlyRevenue.trend}
            trendValue={stats.monthlyRevenue.trendValue}
            helpText={stats.monthlyRevenue.helpText}
          />
          <StatCard
            label="Occupancy Rate"
            value={stats.occupancyRate.value}
            icon={FiTrendingUp}
            color="purple"
            trend={stats.occupancyRate.trend}
            trendValue={stats.occupancyRate.trendValue}
            helpText={stats.occupancyRate.helpText}
            showProgress={stats.occupancyRate.showProgress}
            progressValue={stats.occupancyRate.progressValue}
            progressMax={stats.occupancyRate.progressMax}
          />
        </SimpleGrid>

        {/* Secondary Stats */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6} mb={8}>
          <StatCard
            label="Total Tenants"
            value={stats.totalTenants.value}
            icon={FiUsers}
            color="info"
            trend={stats.totalTenants.trend}
            trendValue={stats.totalTenants.trendValue}
            helpText={stats.totalTenants.helpText}
          />
          <StatCard
            label="Property Views"
            value={stats.propertyViews.value}
            icon={FiEye}
            color="primary"
            trend={stats.propertyViews.trend}
            trendValue={stats.propertyViews.trendValue}
            helpText={stats.propertyViews.helpText}
          />
          <StatCard
            label="Avg. Rating"
            value={stats.avgRating.value}
            icon={FiStar}
            color="warning"
            trend={stats.avgRating.trend}
            trendValue={stats.avgRating.trendValue}
            helpText={stats.avgRating.helpText}
          />
          <StatCard
            label="Completion Rate"
            value={stats.completionRate.value}
            icon={FiCheckCircle}
            color="success"
            trend={stats.completionRate.trend}
            trendValue={stats.completionRate.trendValue}
            helpText={stats.completionRate.helpText}
          />
        </SimpleGrid>

        {/* Charts Section */}
        <SimpleGrid columns={chartsColumns} spacing={6} mb={8}>
          <RevenueChart />
          <OccupancyChart />
        </SimpleGrid>

        {/* Activity and Performance Section */}
        <SimpleGrid columns={chartsColumns} spacing={6}>
          <BookingsTimeline />
          <PropertyPerformance />
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default DashboardPage;
