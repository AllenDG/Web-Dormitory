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
  Progress,
} from '@chakra-ui/react';
import {
  FiSearch,
  FiMoreVertical,
  FiMail,
  FiPhone,
  FiDollarSign,
  FiCalendar,
  FiUser,
} from 'react-icons/fi';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Active Tenants List Component
 * Display and manage current tenants
 */

const TenantCard = ({ tenant, onViewProfile, onContact }) => {
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

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDue = getDaysUntilDue(tenant.nextPaymentDue);

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
              {tenant.unit}
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
            <MenuItem icon={<Icon as={FiPhone} />}>
              Call Tenant
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>

      {/* Payment Status */}
      <VStack align="stretch" spacing={3}>
        <HStack justify="space-between">
          <Text fontSize="sm" color="gray.600">Payment Status:</Text>
          <Badge colorScheme={getPaymentStatusColor(tenant.paymentStatus)} fontSize="xs">
            {tenant.paymentStatus}
          </Badge>
        </HStack>

        <HStack justify="space-between">
          <Text fontSize="sm" color="gray.600">Monthly Rent:</Text>
          <Text fontSize="sm" fontWeight="semibold">
            ₱{tenant.monthlyRent.toLocaleString()}
          </Text>
        </HStack>

        <HStack justify="space-between">
          <Text fontSize="sm" color="gray.600">Next Payment:</Text>
          <Text fontSize="sm" fontWeight="semibold">
            {new Date(tenant.nextPaymentDue).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </Text>
        </HStack>

        {/* Days Until Due */}
        {tenant.paymentStatus !== 'paid' && (
          <Box>
            <HStack justify="space-between" mb={1}>
              <Text fontSize="xs" color="gray.600">
                {daysUntilDue > 0 ? `${daysUntilDue} days until due` : `${Math.abs(daysUntilDue)} days overdue`}
              </Text>
              <Text fontSize="xs" color="gray.600">
                {Math.round((daysUntilDue / 30) * 100)}%
              </Text>
            </HStack>
            <Progress
              value={Math.max(0, Math.min(100, (daysUntilDue / 30) * 100))}
              colorScheme={daysUntilDue > 7 ? 'green' : daysUntilDue > 3 ? 'yellow' : 'red'}
              borderRadius="full"
              size="sm"
            />
          </Box>
        )}

        {/* Lease Info */}
        <HStack justify="space-between" pt={2} borderTop="1px" borderColor="gray.100">
          <Text fontSize="xs" color="gray.600">
            Lease: {new Date(tenant.leaseStart).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {new Date(tenant.leaseEnd).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </Text>
        </HStack>
      </VStack>
    </Box>
  );
};

const ActiveTenantsList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with actual API
  const tenants = [
    {
      id: 1,
      name: 'Juan Dela Cruz',
      avatar: null,
      unit: 'Unit 101',
      monthlyRent: 8000,
      paymentStatus: 'paid',
      nextPaymentDue: '2026-07-01',
      leaseStart: '2026-01-01',
      leaseEnd: '2026-12-31',
      email: 'juan@example.com',
      phone: '+63 912 345 6789',
    },
    {
      id: 2,
      name: 'Maria Santos',
      avatar: null,
      unit: 'Unit 201',
      monthlyRent: 12000,
      paymentStatus: 'pending',
      nextPaymentDue: '2026-06-25',
      leaseStart: '2025-12-01',
      leaseEnd: '2026-11-30',
      email: 'maria@example.com',
      phone: '+63 912 345 6790',
    },
    {
      id: 3,
      name: 'Pedro Garcia',
      avatar: null,
      unit: 'Unit 301',
      monthlyRent: 15000,
      paymentStatus: 'paid',
      nextPaymentDue: '2026-07-01',
      leaseStart: '2026-02-01',
      leaseEnd: '2027-01-31',
      email: 'pedro@example.com',
      phone: '+63 912 345 6791',
    },
    {
      id: 4,
      name: 'Ana Lopez',
      avatar: null,
      unit: 'Unit 102',
      monthlyRent: 8000,
      paymentStatus: 'overdue',
      nextPaymentDue: '2026-05-30',
      leaseStart: '2026-01-01',
      leaseEnd: '2026-12-31',
      email: 'ana@example.com',
      phone: '+63 912 345 6792',
    },
    {
      id: 5,
      name: 'Carlos Reyes',
      avatar: null,
      unit: 'Unit 202',
      monthlyRent: 12000,
      paymentStatus: 'pending',
      nextPaymentDue: '2026-06-28',
      leaseStart: '2026-03-01',
      leaseEnd: '2027-02-28',
      email: 'carlos@example.com',
      phone: '+63 912 345 6793',
    },
    {
      id: 6,
      name: 'Sofia Martinez',
      avatar: null,
      unit: 'Unit 302',
      monthlyRent: 15000,
      paymentStatus: 'paid',
      nextPaymentDue: '2026-07-01',
      leaseStart: '2026-01-15',
      leaseEnd: '2027-01-14',
      email: 'sofia@example.com',
      phone: '+63 912 345 6794',
    },
  ];

  const filteredTenants = tenants.filter((tenant) =>
    tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.unit.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewProfile = (tenant) => {
    navigate(`/owner/tenants/${tenant.id}`);
  };

  const handleContact = (tenant) => {
    navigate(`/owner/chat?tenant=${tenant.id}`);
  };

  const stats = {
    total: tenants.length,
    paid: tenants.filter((t) => t.paymentStatus === 'paid').length,
    pending: tenants.filter((t) => t.paymentStatus === 'pending').length,
    overdue: tenants.filter((t) => t.paymentStatus === 'overdue').length,
  };

  return (
    <Box>
      {/* Header */}
      <VStack align="stretch" spacing={6} mb={6}>
        <Box>
          <Heading size="md" mb={1}>
            Active Tenants
          </Heading>
          <Text fontSize="sm" color="gray.600">
            Manage your current tenants and payments
          </Text>
        </Box>

        {/* Search */}
        <InputGroup>
          <InputLeftElement>
            <Icon as={FiSearch} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search by name or unit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>

        {/* Stats */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
          <Box bg="blue.50" p={4} borderRadius="lg" textAlign="center">
            <Text fontSize="2xl" fontWeight="bold" color="blue.600">
              {stats.total}
            </Text>
            <Text fontSize="xs" color="gray.600">Total Tenants</Text>
          </Box>
          <Box bg="green.50" p={4} borderRadius="lg" textAlign="center">
            <Text fontSize="2xl" fontWeight="bold" color="green.600">
              {stats.paid}
            </Text>
            <Text fontSize="xs" color="gray.600">Paid</Text>
          </Box>
          <Box bg="yellow.50" p={4} borderRadius="lg" textAlign="center">
            <Text fontSize="2xl" fontWeight="bold" color="yellow.600">
              {stats.pending}
            </Text>
            <Text fontSize="xs" color="gray.600">Pending</Text>
          </Box>
          <Box bg="red.50" p={4} borderRadius="lg" textAlign="center">
            <Text fontSize="2xl" fontWeight="bold" color="red.600">
              {stats.overdue}
            </Text>
            <Text fontSize="xs" color="gray.600">Overdue</Text>
          </Box>
        </SimpleGrid>
      </VStack>

      {/* Tenants Grid */}
      {filteredTenants.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          {filteredTenants.map((tenant) => (
            <TenantCard
              key={tenant.id}
              tenant={tenant}
              onViewProfile={handleViewProfile}
              onContact={handleContact}
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
          <Text fontSize="4xl" mb={2}>🔍</Text>
          <Heading size="md" mb={2}>No Tenants Found</Heading>
          <Text color="gray.600">
            {searchQuery
              ? `No tenants match "${searchQuery}"`
              : 'No active tenants at the moment'}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default ActiveTenantsList;
