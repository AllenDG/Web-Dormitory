import { useState } from 'react';
import {
  Box,
  SimpleGrid,
  Image,
  VStack,
  HStack,
  Text,
  Badge,
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import {
  FiSearch,
  FiMoreVertical,
  FiCheckCircle,
  FiXCircle,
  FiEye,
  FiFlag,
} from 'react-icons/fi';
import useRentalStore from '../../../../shared/stores/useRentalStore';

/**
 * PropertyModeration Component
 * Review and moderate property listings
 */
export function PropertyModeration() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const rentals = useRentalStore((state) => state.rentals);
  const approveProperty = useRentalStore((state) => state.approveProperty);
  const rejectProperty = useRentalStore((state) => state.rejectProperty);

  const properties = rentals
    .map((r) => ({
      id: r.id,
      title: r.title,
      owner: r.ownerName,
      price: r.price,
      location: r.city,
      status: r.moderationStatus || 'approved',
      submitted: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—',
      image: r.imageUrl?.[0] || 'https://via.placeholder.com/300x200',
    }))
    .filter((property) => {
      const matchesSearch =
        !searchQuery || property.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

  const handleApprove = (property) => {
    approveProperty(property.id);
    toast({
      title: 'Property Approved',
      description: `${property.title} has been approved and published.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleReject = (property) => {
    rejectProperty(property.id);
    toast({
      title: 'Property Rejected',
      description: `${property.title} has been rejected.`,
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'green';
      case 'rejected':
        return 'red';
      case 'pending':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  return (
    <Box>
      {/* Filters */}
      <HStack spacing={4} mb={6}>
        <InputGroup maxW="300px">
          <InputLeftElement pointerEvents="none">
            <FiSearch color="gray" />
          </InputLeftElement>
          <Input
            placeholder="Search properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>

        <Select
          maxW="150px"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </Select>
      </HStack>

      {/* Property Cards */}
      {properties.length === 0 && (
        <Text textAlign="center" color="gray.500" py={12}>
          No properties match this filter.
        </Text>
      )}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {properties.map((property) => (
          <Box
            key={property.id}
            bg={bgColor}
            borderRadius="8px"
            border="1px"
            borderColor={borderColor}
            overflow="hidden"
            transition="all 0.2s"
            _hover={{
              transform: 'translateY(-4px)',
              shadow: 'lg',
            }}
          >
            <Image
              src={property.image}
              alt={property.title}
              h="200px"
              w="100%"
              objectFit="cover"
            />

            <VStack align="stretch" p={4} spacing={3}>
              <HStack justify="space-between">
                <Badge
                  colorScheme={getStatusColor(property.status)}
                  borderRadius="8px"
                >
                  {property.status}
                </Badge>
                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<FiMoreVertical />}
                    variant="ghost"
                    size="sm"
                    aria-label={`More actions for ${property.title}`}
                  />
                  <MenuList>
                    <MenuItem icon={<FiEye />}>View Details</MenuItem>
                    <MenuItem icon={<FiFlag />}>Report Issue</MenuItem>
                  </MenuList>
                </Menu>
              </HStack>

              <Text fontWeight="bold" fontSize="md" noOfLines={2}>
                {property.title}
              </Text>

              <HStack justify="space-between" fontSize="sm">
                <Text color="gray.600">Owner:</Text>
                <Text fontWeight="medium">{property.owner}</Text>
              </HStack>

              <HStack justify="space-between" fontSize="sm">
                <Text color="gray.600">Location:</Text>
                <Text fontWeight="medium">{property.location}</Text>
              </HStack>

              <HStack justify="space-between">
                <Text fontSize="lg" fontWeight="bold" color="primary.600">
                  ₱{property.price.toLocaleString()}/month
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {property.submitted}
                </Text>
              </HStack>

              {property.status === 'pending' && (
                <HStack spacing={2}>
                  <Button
                    size="sm"
                    colorScheme="green"
                    leftIcon={<FiCheckCircle />}
                    flex={1}
                    onClick={() => handleApprove(property)}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    leftIcon={<FiXCircle />}
                    flex={1}
                    onClick={() => handleReject(property)}
                  >
                    Reject
                  </Button>
                </HStack>
              )}
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
