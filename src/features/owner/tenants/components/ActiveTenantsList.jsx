import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Avatar,
  Badge,
  Button,
  Icon,
  SimpleGrid,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from '@chakra-ui/react';
import {
  FiSearch,
  FiFilter,
  FiMoreVertical,
  FiMail,
  FiPhone,
  FiHome,
  FiCalendar,
  FiDollarSign,
  FiUser,
} from 'react-icons/fi';
import { useState } from 'react';

/**
 * Active Tenants List Component
 * Display and manage current tenants
 */

const TenantCard = ({ tenant, onViewProfile, onContact, onViewPayments }) => {
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'green';
      case 'pending':
        return 'yellow';
      case 'overdue':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <Box
      bg="white"
      p={5}
      borderRadius="lg"
      border="1px"
      borderColor="gray.200"
      transition="all 0.2s"
      _hover={{ boxShadow: 'md' }}
    >
      <HStack justify="space-between" mb={4}>
        <HStack spacing={3}>
          <Avatar size="md" name={tenant.name} src={tenant.avatar} />
          <VStack align="start" spacing={0}>
            <Text fontWeight="semibold">{tenant.name}</Text>
            <Text fontSize="xs" color="gray.600">
              {tenant.email}
            </Text>
          </VStack>
        </HStack>
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<Icon as={FiMoreVertical} />}
            size="sm"
            variant="ghost"
          />
          <MenuList>
            <MenuItem icon={<Icon as={FiUser} />} onClick={() => onViewProfile(tenant)}>
              View Profile
            </MenuItem>
            <MenuItem icon={<Icon as={FiMail} />} onClick={() => onContact(tenant)}>
              Send Message
            </MenuItem>
            <MenuItem icon={<Icon as={FiDollarSign} />} onClick={() => onViewPayments(tenant)}>
              Payment History
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>

      <VStack align="stretch" spacing={3}>
        {/* Unit Info */}
        <HStack justify="space-between">
          <HStack spacing={2}>
            <Icon as={FiHome} boxSize={4} color="gray.500" />
            <Text fontSize="sm" color="gray.600">Unit:</Text>
          </HStack>
          <Text fontSize="sm" fontWeight="semibold">
            {tenant.unit}
          </Text>
        </HStack>

        {/* Move-in Date */}
        <HStack justify="space-between">
          <HStack spacing={2}>
            <Icon as={FiCalendar} boxSize={4} color="gray.500" />
            <Text fontSize="sm" color="gray.600">Move-in:</Text>
          </HStack>
          <Text fontSize="sm">{tenant.moveInDate}</Text>
        </HStack>

        {/* Rent Amount */}
        <HStack justify="space-between">
          <HStack spacing={2}>
            <Icon as={FiDollarSign} boxSize={4} color="gray.500" />
            <Text fontSize="sm" color="gray.600">Rent:</Text>
          </HStack>
          <Text fontSize="sm" fontWeight="semibold" color="primary.600">
            ₱{tenant.rent.toLocaleString()}/mo
          </Text>
        </HStack>

        {/* Payment Status */}
        <HStack justify="space-between">
          <Text fontSize="sm" color="gray.600">Payment Status:</Text>
          <Badge colorScheme={getPaymentStatusColor(tenant.paymentStatus)} fontSize="xs">
            {tenant.paymentStatus}
          </Badge>
        </HStack>

        {/* Contact Info */}
        <HStack spacing={2} pt={2} borderTop="1px" borderColor="gray.100">
          <Button
            size="xs"
            leftIcon={<Icon as={FiPhone} />}
            variant="outline"
            flex={1}
          >
            Call
          </Button>
          <Button
            size="xs"
            leftIcon={<Icon as={FiMail} />}
            variant="outline"
            flex={1}
          >
            Email
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

const ActiveTenantsList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data - replace with actual API
  const tenants = [
    {
      id: 1,
      name: 'Juan Dela Cruz',
      email: 'juan@email.com',
      avatar: null,
      unit: 'Unit 101',
      moveInDate: 'Jan 15, 2026',
      rent: 8000,
      paymentStatus: 'paid',
      phone: '+63 912 345 6789',
    },
    {
      id: 2,
      name: 'Maria Santos',
      email: 'maria@email.com',
      avatar: null,
      unit: 'Unit 201',
      moveInDate: 'Feb 1, 2026',
      rent: 12000,
      paymentStatus: 'paid',
      phone: '+63 912 345 6780',
    },
    {
      id: 3,
      name: 'Pedro Garcia',
      email: 'pedro@email.com',
      avatar: null,
      unit: 'Unit 102',
      moveInDate: 'Mar 10, 2026',
      rent: 8000,
      paymentStatus: 'pending',
      phone: '+63 912 345 6781',
    },
    {
      id: 4,
      name: 'Ana Lopez',
      email: 'ana@email.com',
      avatar: null,
      unit: 'Unit 301',
      moveInDate: 'Apr 5, 2026',
      rent: 15000,
      paymentStatus: 'overdue',
      phone: '+63 912 345 6782',
    },
    {
      id: 5,
      name: 'Carlos Reyes',
      email: 'carlos@email.com',
      avatar: null,
      unit: 'Unit 202',
      moveInDate: 'May 1, 2026',
      rent: 12000,
      paymentStatus: 'paid',
      phone: '+63 912 345 6783',
    },
    {
      id: 6,
      name: 'Sofia Torres',
      email: 'sofia@email.com',
      avatar: null,
      unit: 'Unit 103',
      moveInDate: 'May 15, 2026',
      rent: 8000,
      paymentStatus: 'paid',
      phone: '+63 912 345 6784',
    },
  ];

  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' || tenant.paymentStatus === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const handleViewProfile = (tenant) => {
    console.log('View profile:', tenant);
  };

  const handleContact = (tenant) => {
    console.log('Contact tenant:', tenant);
  };

  const handleViewPayments = (tenant) => {
    console.log('View payments:', tenant);
  };

  const statusCounts = {
    all: tenants.length,
    paid: tenants.filter((t) => t.paymentStatus === 'paid').length,
    pending: tenants.filter((t) => t.paymentStatus === 'pending').length,
    overdue: tenants.filter((t) => t.paymentStatus === 'overdue').length,
  };

  return (
    <Box>
      {/* Header */}
      <HStack justify="space-between" mb={6}>
        <Box>
          <Heading size="md" mb={1}>
            Active Tenants
          </Heading>
          <Text fontSize="sm" color="gray.600">
            {filteredTenants.length} tenant{filteredTenants.length !== 1 ? 's' : ''} found
          </Text>
        </Box>
      </HStack>

      {/* Search and Filters */}
      <HStack spacing={4} mb={6}>
        <InputGroup flex={1}>
          <InputLeftElement>
            <Icon as={FiSearch} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search by name, unit, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>
        <HStack spacing={2}>
          <Button
            size="md"
            variant={filterStatus === 'all' ? 'solid' : 'outline'}
            colorScheme={filterStatus === 'all' ? 'primary' : 'gray'}
            onClick={() => setFilterStatus('all')}
          >
            All ({statusCounts.all})
          </Button>
          <Button
            size="md"
            variant={filterStatus === 'paid' ? 'solid' : 'outline'}
            colorScheme={filterStatus === 'paid' ? 'green' : 'gray'}
            onClick={() => setFilterStatus('paid')}
          >
            Paid ({statusCounts.paid})
          </Button>
          <Button
            size="md"
            variant={filterStatus === 'pending' ? 'solid' : 'outline'}
            colorScheme={filterStatus === 'pending' ? 'yellow' : 'gray'}
            onClick={() => setFilterStatus('pending')}
          >
            Pending ({statusCounts.pending})
          </Button>
          <Button
            size="md"
            variant={filterStatus === 'overdue' ? 'solid' : 'outline'}
            colorScheme={filterStatus === 'overdue' ? 'red' : 'gray'}
            onClick={() => setFilterStatus('overdue')}
          >
            Overdue ({statusCounts.overdue})
          </Button>
        </HStack>
      </HStack>

      {/* Tenants Grid */}
      {filteredTenants.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
          {filteredTenants.map((tenant) => (
            <TenantCard
              key={tenant.id}
              tenant={tenant}
              onViewProfile={handleViewProfile}
              onContact={handleContact}
              onViewPayments={handleViewPayments}
            />
          ))}
        </SimpleGrid>
      ) : (
        <Box
          bg="white"
          p={12}
          borderRadius="lg"
          textAlign="center"
          border="1px"
          borderColor="gray.200"
        >
          <VStack spacing={3}>
            <Text fontSize="4xl">🔍</Text>
            <Heading size="md">No Tenants Found</Heading>
            <Text color="gray.600">
              Try adjusting your search or filters
            </Text>
          </VStack>
        </Box>
      )}
    </Box>
  );
};

export default ActiveTenantsList;
