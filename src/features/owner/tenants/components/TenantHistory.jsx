import {
  Box,
  Text,
  VStack,
  HStack,
  Avatar,
  Badge,
  SimpleGrid,
  Icon,
} from '@chakra-ui/react';
import { FiStar, FiCalendar } from 'react-icons/fi';

/**
 * Tenant History Component
 * Display past tenants and their reviews
 */

const TenantHistoryCard = ({ tenant }) => {
  return (
    <Box
      bg="white"
      p={5}
      borderRadius="lg"
      border="1px"
      borderColor="gray.200"
    >
      <HStack spacing={3} mb={4}>
        <Avatar size="md" name={tenant.name} />
        <VStack align="start" spacing={0}>
          <Text fontWeight="semibold">{tenant.name}</Text>
          <Text fontSize="xs" color="gray.600">{tenant.unit}</Text>
        </VStack>
      </HStack>

      <VStack align="stretch" spacing={2} fontSize="sm">
        <HStack justify="space-between">
          <Text color="gray.600">Stay Duration:</Text>
          <HStack spacing={1}>
            <Icon as={FiCalendar} boxSize={3} />
            <Text fontWeight="semibold">{tenant.duration}</Text>
          </HStack>
        </HStack>

        <HStack justify="space-between">
          <Text color="gray.600">Rating:</Text>
          <HStack spacing={1}>
            <Icon as={FiStar} boxSize={3} color="yellow.500" />
            <Text fontWeight="semibold">{tenant.rating}/5</Text>
          </HStack>
        </HStack>

        {tenant.review && (
          <Box pt={2} borderTop="1px" borderColor="gray.100">
            <Text fontSize="xs" color="gray.600" mb={1}>Review:</Text>
            <Text fontSize="xs" color="gray.700">{tenant.review}</Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

const TenantHistory = () => {
  // Mock data
  const pastTenants = [
    {
      id: 1,
      name: 'Roberto Cruz',
      unit: 'Unit 103',
      duration: '12 months',
      rating: 5.0,
      review: 'Excellent tenant, always paid on time and kept the unit clean.',
    },
    {
      id: 2,
      name: 'Lisa Wong',
      unit: 'Unit 205',
      duration: '8 months',
      rating: 4.5,
      review: 'Great tenant, very respectful and communicative.',
    },
  ];

  return (
    <Box>
      <Text fontSize="sm" color="gray.600" mb={6}>
        Past tenants and their reviews
      </Text>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {pastTenants.map((tenant) => (
          <TenantHistoryCard key={tenant.id} tenant={tenant} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default TenantHistory;
