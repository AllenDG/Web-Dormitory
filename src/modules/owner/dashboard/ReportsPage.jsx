import { Box, Container, Heading, Text, VStack, SimpleGrid } from '@chakra-ui/react';
import RevenueChart from './components/RevenueChart';
import OccupancyChart from './components/OccupancyChart';
import BookingsTimeline from './components/BookingsTimeline';
import PropertyPerformance from './components/PropertyPerformance';

/**
 * Reports Page
 * Full-width analytics view, reusing the dashboard's chart components.
 */
const ReportsPage = () => {
  return (
    <Box bg="gray.50" minH="100vh" pb={8}>
      <Container maxW="container.xl" py={8}>
        <VStack align="start" spacing={2} mb={8}>
          <Heading size="lg">Reports</Heading>
          <Text color="gray.600">
            Revenue, occupancy, and booking analytics across your properties.
          </Text>
        </VStack>

        <VStack align="stretch" spacing={6}>
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
            <RevenueChart />
            <OccupancyChart />
          </SimpleGrid>
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
            <BookingsTimeline />
            <PropertyPerformance />
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

export default ReportsPage;
