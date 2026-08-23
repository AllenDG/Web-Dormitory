import { Box, Heading, Text, VStack, HStack, Progress, Badge, Icon, Button } from '@chakra-ui/react';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { computePropertyPerformance } from '../utils/ownerAnalytics';

const RANK_COLORS = ['yellow.400', 'gray.400', 'orange.400'];

const PropertyPerformanceItem = ({ property, rank }) => (
  <HStack p={4} borderRadius="lg" bg="gray.50" spacing={4} _hover={{ bg: 'gray.100' }} transition="all 0.2s">
    <Box
      bg={RANK_COLORS[rank - 1] || 'gray.300'}
      color="white"
      fontWeight="bold"
      fontSize="lg"
      w="40px"
      h="40px"
      borderRadius="full"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexShrink={0}
    >
      {rank}
    </Box>

    <Box flex={1} minW={0}>
      <HStack justify="space-between" mb={2}>
        <VStack align="start" spacing={0}>
          <Text fontWeight="semibold" fontSize="sm" noOfLines={1}>{property.name}</Text>
          <Text fontSize="xs" color="gray.600">{property.location}</Text>
        </VStack>
        {property.change > 0 && (
          <Badge colorScheme={property.trend === 'up' ? 'green' : 'red'} fontSize="xs">
            <HStack spacing={1}>
              <Icon as={property.trend === 'up' ? FiTrendingUp : FiTrendingDown} boxSize={3} />
              <Text>{property.change}%</Text>
            </HStack>
          </Badge>
        )}
      </HStack>

      <HStack spacing={6} fontSize="xs" color="gray.600" mb={2}>
        <Text>👥 {property.bookings} bookings</Text>
        <Text>💰 ₱{property.revenue.toLocaleString()}</Text>
        <Text>⭐ {property.rating ?? '—'}</Text>
      </HStack>

      <VStack align="stretch" spacing={1}>
        <HStack justify="space-between" fontSize="xs">
          <Text color="gray.600">Occupancy</Text>
          <Text fontWeight="semibold">{property.occupancy}%</Text>
        </HStack>
        <Progress value={property.occupancy} size="sm" colorScheme={property.occupancy >= 80 ? 'green' : 'blue'} borderRadius="full" />
      </VStack>
    </Box>
  </HStack>
);

/** Property Performance — real top-5 properties by revenue this session's data. */
const PropertyPerformance = ({ properties, bookings, propertyRatings }) => {
  const navigate = useNavigate();
  const topProperties = computePropertyPerformance(properties, bookings, propertyRatings, 5);

  return (
    <Box bg="white" p={6} borderRadius="lg" border="1px" borderColor="gray.200" boxShadow="sm">
      <HStack justify="space-between" mb={6}>
        <Box>
          <Heading size="md" mb={1}>Top Performing Properties</Heading>
          <Text fontSize="sm" color="gray.600">Based on revenue and occupancy</Text>
        </Box>
        <Button size="sm" variant="outline" colorScheme="primary" onClick={() => navigate('/owner/properties')}>
          View All
        </Button>
      </HStack>

      {topProperties.length === 0 ? (
        <Text color="gray.500" py={6} textAlign="center">Add a property to see performance data.</Text>
      ) : (
        <VStack align="stretch" spacing={3}>
          {topProperties.map((property, index) => (
            <PropertyPerformanceItem key={property.id} property={property} rank={index + 1} />
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default PropertyPerformance;
