import {
  Box,
  SimpleGrid,
  Heading,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
  VStack,
  HStack,
  Badge,
} from '@chakra-ui/react';
import { FiHome, FiCalendar, FiDollarSign, FiTrendingUp } from 'react-icons/fi';

/**
 * Owner Dashboard Page
 * Overview of owner's properties, bookings, and revenue
 */

const StatCard = ({ label, value, helpText, icon, color }) => (
  <Box
    bg="white"
    p={6}
    borderRadius="lg"
    border="1px"
    borderColor="gray.200"
    boxShadow="sm"
  >
    <HStack justify="space-between" mb={4}>
      <Box
        p={3}
        borderRadius="lg"
        bg={`${color}.50`}
      >
        <Icon as={icon} boxSize={6} color={`${color}.600`} />
      </Box>
    </HStack>
    <Stat>
      <StatLabel fontSize="sm" color="gray.600" fontWeight="medium">
        {label}
      </StatLabel>
      <StatNumber fontSize="3xl" fontWeight="bold" color="gray.900" mt={2}>
        {value}
      </StatNumber>
      {helpText && (
        <StatHelpText fontSize="sm" color="gray.500" mt={2}>
          {helpText}
        </StatHelpText>
      )}
    </Stat>
  </Box>
);

const DashboardPage = () => {
  // Mock data - replace with actual API calls
  const stats = {
    totalProperties: 5,
    activeBookings: 12,
    monthlyRevenue: '₱45,000',
    occupancyRate: '85%',
  };

  const recentBookings = [
    {
      id: 1,
      tenant: 'Juan Dela Cruz',
      property: 'Modern Studio Room',
      date: '2026-06-01',
      status: 'confirmed',
    },
    {
      id: 2,
      tenant: 'Maria Santos',
      property: 'Premium Condo Unit',
      date: '2026-06-05',
      status: 'pending',
    },
    {
      id: 3,
      tenant: 'Pedro Garcia',
      property: 'Cozy Single Room',
      date: '2026-06-10',
      status: 'confirmed',
    },
  ];

  return (
    <Box>
      {/* Page Header */}
      <Box mb={8}>
        <Heading size="lg" mb={2}>
          Dashboard Overview
        </Heading>
        <Text color="gray.600">
          Monitor your properties, bookings, and revenue at a glance
        </Text>
      </Box>

      {/* Stats Grid */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <StatCard
          label="Total Properties"
          value={stats.totalProperties}
          helpText="Active listings"
          icon={FiHome}
          color="primary"
        />
        <StatCard
          label="Active Bookings"
          value={stats.activeBookings}
          helpText="Current month"
          icon={FiCalendar}
          color="success"
        />
        <StatCard
          label="Monthly Revenue"
          value={stats.monthlyRevenue}
          helpText="+12% from last month"
          icon={FiDollarSign}
          color="warning"
        />
        <StatCard
          label="Occupancy Rate"
          value={stats.occupancyRate}
          helpText="Across all properties"
          icon={FiTrendingUp}
          color="info"
        />
      </SimpleGrid>

      {/* Recent Bookings */}
      <Box
        bg="white"
        p={6}
        borderRadius="lg"
        border="1px"
        borderColor="gray.200"
        boxShadow="sm"
      >
        <Heading size="md" mb={4}>
          Recent Bookings
        </Heading>
        <VStack spacing={4} align="stretch">
          {recentBookings.map((booking) => (
            <Box
              key={booking.id}
              p={4}
              borderRadius="lg"
              border="1px"
              borderColor="gray.200"
              _hover={{ bg: 'gray.50' }}
              transition="all 0.2s"
            >
              <HStack justify="space-between">
                <VStack align="start" spacing={1}>
                  <Text fontWeight="semibold">{booking.tenant}</Text>
                  <Text fontSize="sm" color="gray.600">
                    {booking.property}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {new Date(booking.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </Text>
                </VStack>
                <Badge
                  colorScheme={booking.status === 'confirmed' ? 'green' : 'yellow'}
                  fontSize="xs"
                  px={3}
                  py={1}
                  borderRadius="md"
                >
                  {booking.status}
                </Badge>
              </HStack>
            </Box>
          ))}
        </VStack>
      </Box>
    </Box>
  );
};

export default DashboardPage;
