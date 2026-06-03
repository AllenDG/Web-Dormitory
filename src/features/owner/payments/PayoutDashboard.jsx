import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Icon,
  SimpleGrid,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Select,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Progress,
} from '@chakra-ui/react';
import {
  FiDollarSign,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiDownload,
  FiPlus,
} from 'react-icons/fi';
import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

/**
 * Payout Dashboard Page
 * Owner earnings and payout management
 * Week 14 - Payments & Transactions
 */

const StatCard = ({ label, value, icon, color, trend, trendValue }) => {
  return (
    <Box
      bg="white"
      p={6}
      borderRadius="lg"
      border="1px"
      borderColor="gray.200"
      boxShadow="sm"
    >
      <HStack justify="space-between" mb={3}>
        <Box bg={`${color}.50`} p={3} borderRadius="lg">
          <Icon as={icon} boxSize={6} color={`${color}.600`} />
        </Box>
        {trend && (
          <Badge colorScheme={trend === 'up' ? 'green' : 'red'} fontSize="xs">
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </Badge>
        )}
      </HStack>
      <VStack align="start" spacing={1}>
        <Text fontSize="sm" color="gray.600" fontWeight="medium">
          {label}
        </Text>
        <Text fontSize="3xl" fontWeight="bold" color="gray.900">
          {value}
        </Text>
      </VStack>
    </Box>
  );
};

const PayoutCard = ({ payout }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'green';
      case 'pending':
        return 'yellow';
      case 'processing':
        return 'blue';
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
    >
      <HStack justify="space-between" mb={3}>
        <VStack align="start" spacing={0}>
          <Text fontWeight="semibold">
            ₱{payout.amount.toLocaleString()}
          </Text>
          <Text fontSize="xs" color="gray.600">
            {payout.date}
          </Text>
        </VStack>
        <Badge colorScheme={getStatusColor(payout.status)} fontSize="xs">
          {payout.status}
        </Badge>
      </HStack>
      <VStack align="stretch" spacing={2} fontSize="sm">
        <HStack justify="space-between">
          <Text color="gray.600">Method:</Text>
          <Text fontWeight="medium">{payout.method}</Text>
        </HStack>
        <HStack justify="space-between">
          <Text color="gray.600">Reference:</Text>
          <Text fontSize="xs" fontFamily="mono">
            {payout.reference}
          </Text>
        </HStack>
      </VStack>
    </Box>
  );
};

const PayoutDashboard = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [timeRange, setTimeRange] = useState('monthly');

  // Mock data
  const stats = {
    availableBalance: 45000,
    pendingPayouts: 12000,
    totalEarnings: 156000,
    nextPayout: '₱15,000',
  };

  const earningsData = [
    { month: 'Jan', earnings: 28000 },
    { month: 'Feb', earnings: 32000 },
    { month: 'Mar', earnings: 29000 },
    { month: 'Apr', earnings: 35000 },
    { month: 'May', earnings: 32000 },
    { month: 'Jun', earnings: 45000 },
  ];

  const recentPayouts = [
    {
      id: 1,
      amount: 25000,
      date: 'May 31, 2026',
      method: 'Bank Transfer',
      reference: 'PAY-20260531-001',
      status: 'completed',
    },
    {
      id: 2,
      amount: 22000,
      date: 'May 15, 2026',
      method: 'GCash',
      reference: 'PAY-20260515-002',
      status: 'completed',
    },
    {
      id: 3,
      amount: 12000,
      date: 'June 5, 2026',
      method: 'Bank Transfer',
      reference: 'PAY-20260605-003',
      status: 'processing',
    },
  ];

  const handleRequestPayout = () => {
    toast({
      title: 'Payout Requested',
      description: 'Your payout request has been submitted.',
      status: 'success',
      duration: 3000,
    });
    onClose();
  };

  return (
    <Box bg="gray.50" minH="100vh" py={8}>
      <Container maxW="container.xl">
        {/* Header */}
        <HStack justify="space-between" mb={8}>
          <VStack align="start" spacing={2}>
            <Heading size="lg">Payouts & Earnings</Heading>
            <Text color="gray.600">
              Manage your earnings and payout schedule
            </Text>
          </VStack>
          <Button
            leftIcon={<Icon as={FiPlus} />}
            colorScheme="primary"
            onClick={onOpen}
          >
            Request Payout
          </Button>
        </HStack>

        {/* Stats */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
          <StatCard
            label="Available Balance"
            value={`₱${stats.availableBalance.toLocaleString()}`}
            icon={FiDollarSign}
            color="success"
            trend="up"
            trendValue="+15%"
          />
          <StatCard
            label="Pending Payouts"
            value={`₱${stats.pendingPayouts.toLocaleString()}`}
            icon={FiClock}
            color="warning"
          />
          <StatCard
            label="Total Earnings"
            value={`₱${stats.totalEarnings.toLocaleString()}`}
            icon={FiTrendingUp}
            color="primary"
            trend="up"
            trendValue="+22%"
          />
          <StatCard
            label="Next Payout"
            value={stats.nextPayout}
            icon={FiCheckCircle}
            color="purple"
          />
        </SimpleGrid>

        {/* Earnings Chart */}
        <Box
          bg="white"
          p={6}
          borderRadius="lg"
          border="1px"
          borderColor="gray.200"
          mb={8}
        >
          <HStack justify="space-between" mb={6}>
            <Box>
              <Heading size="md" mb={1}>
                Earnings Overview
              </Heading>
              <Text fontSize="sm" color="gray.600">
                Track your monthly earnings
              </Text>
            </Box>
            <Select
              size="sm"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              w="150px"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </Select>
          </HStack>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={earningsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
                tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
                formatter={(value) => [`₱${value.toLocaleString()}`, 'Earnings']}
              />
              <Line
                type="monotone"
                dataKey="earnings"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: '#10B981', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>

        {/* Tabs */}
        <Tabs colorScheme="primary">
          <TabList>
            <Tab>Recent Payouts</Tab>
            <Tab>Payout Schedule</Tab>
            <Tab>Bank Accounts</Tab>
          </TabList>

          <TabPanels>
            {/* Recent Payouts Tab */}
            <TabPanel px={0} py={6}>
              <VStack align="stretch" spacing={4}>
                {recentPayouts.map((payout) => (
                  <PayoutCard key={payout.id} payout={payout} />
                ))}
              </VStack>
            </TabPanel>

            {/* Payout Schedule Tab */}
            <TabPanel px={0} py={6}>
              <Box
                bg="white"
                p={8}
                borderRadius="lg"
                border="1px"
                borderColor="gray.200"
              >
                <VStack spacing={4}>
                  <Icon as={FiCalendar} boxSize={12} color="primary.500" />
                  <Heading size="md">Automatic Payouts</Heading>
                  <Text color="gray.600" textAlign="center">
                    Your earnings are automatically paid out every 15th and end of month.
                  </Text>
                  <Box w="full" maxW="400px">
                    <HStack justify="space-between" mb={2}>
                      <Text fontSize="sm" color="gray.600">
                        Next Payout:
                      </Text>
                      <Text fontSize="sm" fontWeight="bold">
                        June 15, 2026
                      </Text>
                    </HStack>
                    <Progress
                      value={65}
                      size="sm"
                      colorScheme="primary"
                      borderRadius="full"
                    />
                    <Text fontSize="xs" color="gray.500" mt={2} textAlign="center">
                      5 days remaining
                    </Text>
                  </Box>
                </VStack>
              </Box>
            </TabPanel>

            {/* Bank Accounts Tab */}
            <TabPanel px={0} py={6}>
              <Box
                bg="white"
                p={8}
                borderRadius="lg"
                border="1px"
                borderColor="gray.200"
                textAlign="center"
              >
                <VStack spacing={4}>
                  <Icon as={FiDollarSign} boxSize={12} color="gray.400" />
                  <Heading size="md">Bank Accounts</Heading>
                  <Text color="gray.600">
                    Manage your payout bank accounts
                  </Text>
                  <Button
                    leftIcon={<Icon as={FiPlus} />}
                    colorScheme="primary"
                  >
                    Add Bank Account
                  </Button>
                </VStack>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>

        {/* Request Payout Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="md">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Request Payout</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <Box w="full" textAlign="center" bg="gray.50" p={4} borderRadius="lg">
                  <Text fontSize="sm" color="gray.600" mb={1}>
                    Available Balance
                  </Text>
                  <Text fontSize="3xl" fontWeight="bold" color="success.500">
                    ₱{stats.availableBalance.toLocaleString()}
                  </Text>
                </Box>

                <FormControl isRequired>
                  <FormLabel fontSize="sm">Amount to Withdraw</FormLabel>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    defaultValue={stats.availableBalance}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="sm">Payout Method</FormLabel>
                  <Select>
                    <option value="bank">Bank Transfer</option>
                    <option value="gcash">GCash</option>
                    <option value="paymaya">PayMaya</option>
                  </Select>
                </FormControl>

                <Box w="full" bg="blue.50" p={3} borderRadius="md" fontSize="sm">
                  <Text color="blue.700">
                    💡 Payouts typically process within 1-3 business days
                  </Text>
                </Box>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="primary" onClick={handleRequestPayout}>
                Request Payout
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
};

export default PayoutDashboard;
