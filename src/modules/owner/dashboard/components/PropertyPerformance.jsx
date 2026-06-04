import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Progress,
  Badge,
  Avatar,
  Button,
  Icon,
} from '@chakra-ui/react';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

/**
 * Property Performance Component
 * Shows top performing properties with metrics
 */

const PropertyPerformanceItem = ({ property, rank }) => {
  const getRankColor = (rank) => {
    if (rank === 1) return 'yellow.400';
    if (rank === 2) return 'gray.400';
    if (rank === 3) return 'orange.400';
    return 'gray.300';
  };

  return (
    <HStack
      p={4}
      borderRadius="lg"
      bg="gray.50"
      spacing={4}
      _hover={{ bg: 'gray.100' }}
      transition="all 0.2s"
    >
      {/* Rank Badge */}
      <Box
        bg={getRankColor(rank)}
        color="white"
        fontWeight="bold"
        fontSize="lg"
        w="40px"
        h="40px"
        borderRadius="full"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {rank}
      </Box>

      {/* Property Info */}
      <Box flex={1}>
        <HStack justify="space-between" mb={2}>
          <VStack align="start" spacing={0}>
            <Text fontWeight="semibold" fontSize="sm">
              {property.name}
            </Text>
            <Text fontSize="xs" color="gray.600">
              {property.location}
            </Text>
          </VStack>
          <Badge colorScheme={property.trend === 'up' ? 'green' : 'red'} fontSize="xs">
            <HStack spacing={1}>
              <Icon
                as={property.trend === 'up' ? FiTrendingUp : FiTrendingDown}
                boxSize={3}
              />
              <Text>{property.change}%</Text>
            </HStack>
          </Badge>
        </HStack>

        {/* Metrics */}
        <HStack spacing={6} fontSize="xs" color="gray.600" mb={2}>
          <Text>👥 {property.bookings} bookings</Text>
          <Text>💰 ₱{property.revenue.toLocaleString()}</Text>
          <Text>⭐ {property.rating}</Text>
        </HStack>

        {/* Occupancy Progress */}
        <VStack align="stretch" spacing={1}>
          <HStack justify="space-between" fontSize="xs">
            <Text color="gray.600">Occupancy</Text>
            <Text fontWeight="semibold">{property.occupancy}%</Text>
          </HStack>
          <Progress
            value={property.occupancy}
            size="sm"
            colorScheme={property.occupancy >= 80 ? 'green' : 'blue'}
            borderRadius="full"
          />
        </VStack>
      </Box>
    </HStack>
  );
};

const PropertyPerformance = () => {
  // Mock data - replace with actual API data
  const topProperties = [
    {
      id: 1,
      name: 'Premium Condo Unit',
      location: 'Makati City',
      bookings: 24,
      revenue: 96000,
      rating: 4.8,
      occupancy: 92,
      trend: 'up',
      change: 15,
    },
    {
      id: 2,
      name: 'Modern Studio Room',
      location: 'BGC, Taguig',
      bookings: 18,
      revenue: 72000,
      rating: 4.7,
      occupancy: 85,
      trend: 'up',
      change: 8,
    },
    {
      id: 3,
      name: 'Cozy Single Room',
      location: 'Quezon City',
      bookings: 15,
      revenue: 45000,
      rating: 4.6,
      occupancy: 78,
      trend: 'down',
      change: 5,
    },
    {
      id: 4,
      name: 'Deluxe Double Room',
      location: 'Pasig City',
      bookings: 12,
      revenue: 60000,
      rating: 4.5,
      occupancy: 75,
      trend: 'up',
      change: 12,
    },
    {
      id: 5,
      name: 'Budget Shared Room',
      location: 'Manila',
      bookings: 10,
      revenue: 30000,
      rating: 4.3,
      occupancy: 68,
      trend: 'down',
      change: 3,
    },
  ];

  return (
    <Box
      bg="white"
      p={6}
      borderRadius="lg"
      border="1px"
      borderColor="gray.200"
      boxShadow="sm"
    >
      {/* Header */}
      <HStack justify="space-between" mb={6}>
        <Box>
          <Heading size="md" mb={1}>
            Top Performing Properties
          </Heading>
          <Text fontSize="sm" color="gray.600">
            Based on revenue and occupancy rate
          </Text>
        </Box>
        <Button size="sm" variant="outline" colorScheme="primary">
          View Report
        </Button>
      </HStack>

      {/* Properties List */}
      <VStack align="stretch" spacing={3}>
        {topProperties.map((property, index) => (
          <PropertyPerformanceItem
            key={property.id}
            property={property}
            rank={index + 1}
          />
        ))}
      </VStack>
    </Box>
  );
};

export default PropertyPerformance;
