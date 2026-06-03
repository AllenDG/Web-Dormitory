import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Button,
  Icon,
  SimpleGrid,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Avatar,
  Divider,
  useToast,
} from '@chakra-ui/react';
import {
  FiSearch,
  FiDownload,
  FiFilter,
  FiCalendar,
  FiDollarSign,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiAlertCircle,
} from 'react-icons/fi';
import { useState } from 'react';
import { format } from 'date-fns';

/**
 * Transaction History Page
 * View all payment transactions
 * Week 14 - Payments & Transactions
 */

const StatCard = ({ label, value, icon, color }) => {
  return (
    <Box
      bg="white"
      p={5}
      borderRadius="lg"
      border="1px"
      borderColor="gray.200"
    >
      <HStack spacing={3}>
        <Box bg={`${color}.50`} p={3} borderRadius="lg">
          <Icon as={icon} boxSize={5} color={`${color}.600`} />
        </Box>
        <VStack align="start" spacing={0}>
          <Text fontSize="sm" color="gray.600">
            {label}
          </Text>
          <Text fontSize="2xl" fontWeight="bold">
            {value}
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
};

const TransactionCard = ({ transaction, onViewReceipt }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed':
        return { color: 'green', icon: FiCheckCircle, label: 'Completed' };
      case 'pending':
        return { color: 'yellow', icon: FiClock, label: 'Pending' };
      case 'failed':
        return { color: 'red', icon: FiXCircle, label: 'Failed' };
      case 'refunded':
        return { color: 'blue', icon: FiAlertCircle, label: 'Refunded' };
      default:
        return { color: 'gray', icon: FiClock, label: 'Unknown' };
    }
  };

  const statusConfig = getStatusConfig(transaction.status);

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
      <VStack align="stretch" spacing={4}>
        {/* Header */}
        <HStack justify="space-between">
          <HStack spacing={3}>
            <Avatar
              size="sm"
              name={transaction.property}
              bg="primary.500"
            />
            <VStack align="start" spacing={0}>
              <Text fontWeight="semibold" fontSize="sm">
                {transaction.property}
              </Text>
              <Text fontSize="xs" color="gray.600">
                {transaction.type}
              </Text>
            </VStack>
          </HStack>
          <Badge
            colorScheme={statusConfig.color}
            fontSize="xs"
            px={2}
            py={1}
          >
            <HStack spacing={1}>
              <Icon as={statusConfig.icon} boxSize={3} />
              <Text>{statusConfig.label}</Text>
            </HStack>
          </Badge>
        </HStack>

        <Divider />

        {/* Details */}
        <SimpleGrid columns={2} spacing={3}>
          <Box>
            <Text fontSize="xs" color="gray.600" mb={1}>
              Amount
            </Text>
            <Text fontWeight="bold" color="primary.600">
              ₱{transaction.amount.toLocaleString()}
            </Text>
          </Box>
          <Box>
            <Text fontSize="xs" color="gray.600" mb={1}>
              Date
            </Text>
            <Text fontWeight="semibold" fontSize="sm">
              {format(new Date(transaction.date), 'MMM d, yyyy')}
            </Text>
          </Box>
          <Box>
            <Text fontSize="xs" color="gray.600" mb={1}>
              Method
            </Text>
            <Text fontSize="sm">{transaction.method}</Text>
          </Box>
          <Box>
            <Text fontSize="xs" color="gray.600" mb={1}>
              Reference
            </Text>
            <Text fontSize="xs" fontFamily="mono">
              {transaction.reference}
            </Text>
          </Box>
        </SimpleGrid>

        {/* Actions */}
        {transaction.status === 'completed' && (
          <Button
            size="sm"
            leftIcon={<Icon as={FiDownload} />}
            variant="outline"
            colorScheme="primary"
            onClick={() => onViewReceipt(transaction)}
          >
            Download Receipt
          </Button>
        )}
      </VStack>
    </Box>
  );
};

const TransactionHistoryPage = () => {
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('all');

  // Mock data
  const transactions = [
    {
      id: 1,
      property: 'Modern Studio Room',
      type: 'Monthly Rent Payment',
      amount: 8000,
      date: '2026-06-01T10:00:00',
      method: 'GCash',
      reference: 'TXN-20260601-001',
      status: 'completed',
    },
    {
      id: 2,
      property: 'Premium Condo Unit',
      type: 'Security Deposit',
      amount: 16000,
      date: '2026-05-28T14:30:00',
      method: 'Credit Card',
      reference: 'TXN-20260528-002',
      status: 'completed',
    },
    {
      id: 3,
      property: 'Cozy Single Room',
      type: 'Monthly Rent Payment',
      amount: 6000,
      date: '2026-05-25T09:15:00',
      method: 'PayMaya',
      reference: 'TXN-20260525-003',
      status: 'pending',
    },
    {
      id: 4,
      property: 'Deluxe Double Room',
      type: 'Booking Fee',
      amount: 2000,
      date: '2026-05-20T16:45:00',
      method: 'Bank Transfer',
      reference: 'TXN-20260520-004',
      status: 'failed',
    },
    {
      id: 5,
      property: 'Budget Shared Room',
      type: 'Monthly Rent Payment',
      amount: 4500,
      date: '2026-05-15T11:20:00',
      method: 'GCash',
      reference: 'TXN-20260515-005',
      status: 'completed',
    },
  ];

  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch =
      txn.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.reference.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' || txn.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: transactions.length,
    completed: transactions.filter((t) => t.status === 'completed').length,
    pending: transactions.filter((t) => t.status === 'pending').length,
    totalAmount: transactions
      .filter((t) => t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0),
  };

  const handleViewReceipt = (transaction) => {
    toast({
      title: 'Downloading Receipt',
      description: `Receipt for ${transaction.reference}`,
      status: 'info',
      duration: 3000,
    });
  };

  const handleExport = () => {
    toast({
      title: 'Exporting Transactions',
      description: 'Your transaction history will be downloaded shortly.',
      status: 'success',
      duration: 3000,
    });
  };

  return (
    <Box bg="gray.50" minH="100vh" py={8}>
      <Container maxW="container.xl">
        {/* Header */}
        <VStack align="start" spacing={2} mb={8}>
          <Heading size="lg">Transaction History</Heading>
          <Text color="gray.600">
            View and manage your payment transactions
          </Text>
        </VStack>

        {/* Stats */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={8}>
          <StatCard
            label="Total Transactions"
            value={stats.total}
            icon={FiCalendar}
            color="primary"
          />
          <StatCard
            label="Completed"
            value={stats.completed}
            icon={FiCheckCircle}
            color="success"
          />
          <StatCard
            label="Pending"
            value={stats.pending}
            icon={FiClock}
            color="warning"
          />
          <StatCard
            label="Total Paid"
            value={`₱${stats.totalAmount.toLocaleString()}`}
            icon={FiDollarSign}
            color="purple"
          />
        </SimpleGrid>

        {/* Filters */}
        <Box
          bg="white"
          p={6}
          borderRadius="lg"
          border="1px"
          borderColor="gray.200"
          mb={6}
        >
          <HStack spacing={4} flexWrap="wrap">
            <InputGroup flex={1} minW="250px">
              <InputLeftElement>
                <Icon as={FiSearch} color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>

            <Select
              w="180px"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </Select>

            <Select
              w="180px"
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </Select>

            <Button
              leftIcon={<Icon as={FiDownload} />}
              variant="outline"
              colorScheme="primary"
              onClick={handleExport}
            >
              Export
            </Button>
          </HStack>
        </Box>

        {/* Transactions List */}
        {filteredTransactions.length > 0 ? (
          <VStack align="stretch" spacing={4}>
            {filteredTransactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                onViewReceipt={handleViewReceipt}
              />
            ))}
          </VStack>
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
              <Text fontSize="4xl">💳</Text>
              <Heading size="md">No Transactions Found</Heading>
              <Text color="gray.600">
                Try adjusting your search or filters
              </Text>
            </VStack>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default TransactionHistoryPage;
