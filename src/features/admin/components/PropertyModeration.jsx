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

  // Mock data - will be replaced with API
  const properties = [
    {
      id: 1,
      title: 'Cozy Studio Near University',
      owner: 'Maria Santos',
      price: 8000,
      location: 'Dagupan City',
      status: 'pending',
      submitted: '2 hours ago',
      image: 'https://via.placeholder.com/300x200',
    },
    {
      id: 2,
      title: 'Modern Apartment with WiFi',
      owner: 'Ana Reyes',
      price: 12000,
      location: 'Manila',
      status: 'pending',
      submitted: '5 hours ago',
      image: 'https://via.placeholder.com/300x200',
    },
    {
      id: 3,
      title: 'Spacious Room for Students',
      owner: 'Pedro Garcia',
      price: 6500,
      location: 'Quezon City',
      status: 'pending',
      submitted: '1 day ago',
      image: 'https://via.placeholder.com/300x200',
    },
    {
      id: 4,
      title: 'Affordable Dorm Room',
      owner: 'Carlos Ramos',
      price: 5000,
      location: 'Baguio City',
      status: 'pending',
      submitted: '2 days ago',
      image: 'https://via.placeholder.com/300x200',
    },
  ];

  const handleApprove = (property) => {
    toast({
      title: 'Property Approved',
      description: `${property.title} has been approved and published.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleReject = (property) => {
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
