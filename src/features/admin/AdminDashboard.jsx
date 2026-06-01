import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardBody,
  Button,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
  FiUsers,
  FiHome,
  FiCalendar,
  FiDollarSign,
  FiTrendingUp,
  FiMessageSquare,
  FiAlertCircle,
  FiCheckCircle,
} from 'react-icons/fi';
import { useAuth } from '../../app/providers/AuthProvider';

/**
 * Admin Dashboard
 * 
 * Main dashboard for administrators
 * Overview of platform statistics and management
 * 
 * @component
 */
const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  // Redirect if not admin
  if (!isAdmin()) {
    navigate('/');
    return null;
  }

  // Mock statistics
  const stats = {
    totalUsers: 1247,
    totalProperties: 342,
    totalBookings: 856,
    totalRevenue: 2450000,
    pendingApprovals: 12,
    activeChats: 45,
    newUsers: 23,
    newProperties: 8,
  };

  return (
    <Box bg="gray.50" minH="100vh" py={8}>
      <Container maxW="1400px">
        {/* Header */}
        <VStack spacing={6} mb={8} align="start">
          <VStack align="start" spacing={2}>
            <Heading size="lg" color="gray.900">
              Admin Dashboard
            </Heading>
            <Text color="gray.600" fontSize="sm">
              Welcome back, {user?.name}
            </Text>
          </VStack>

          {/* Quick Stats */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} w="full">
            <Card>
              <CardBody>
                <Stat>
                  <HStack justify="space-between" mb={2}>
                    <StatLabel>Total Users</StatLabel>
                    <Icon as={FiUsers} boxSize={5} color="primary.500" />
                  </HStack>
                  <StatNumber>{stats.totalUsers.toLocaleString()}</StatNumber>
                  <StatHelpText>
                    <HStack>
                      <Icon as={FiTrendingUp} color="green.500" />
                      <Text>+{stats.newUsers} this week</Text>
                    </HStack>
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <HStack justify="space-between" mb={2}>
                    <StatLabel>Total Properties</StatLabel>
                    <Icon as={FiHome} boxSize={5} color="blue.500" />
                  </HStack>
                  <StatNumber>{stats.totalProperties.toLocaleString()}</StatNumber>
                  <StatHelpText>
                    <HStack>
                      <Icon as={FiTrendingUp} color="green.500" />
                      <Text>+{stats.newProperties} this week</Text>
                    </HStack>
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <HStack justify="space-between" mb={2}>
                    <StatLabel>Total Bookings</StatLabel>
                    <Icon as={FiCalendar} boxSize={5} color="purple.500" />
                  </HStack>
                  <StatNumber>{stats.totalBookings.toLocaleString()}</StatNumber>
                  <StatHelpText>All time bookings</StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <HStack justify="space-between" mb={2}>
                    <StatLabel>Total Revenue</StatLabel>
                    <Icon as={FiDollarSign} boxSize={5} color="green.500" />
                  </HStack>
                  <StatNumber>₱{(stats.totalRevenue / 1000000).toFixed(2)}M</StatNumber>
                  <StatHelpText>Platform revenue</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>
        </VStack>

        {/* Management Sections */}
        <Tabs colorScheme="primary" isLazy>
          <TabList>
            <Tab>
              Pending Approvals
              {stats.pendingApprovals > 0 && (
                <Badge ml={2} colorScheme="red" borderRadius="full">
                  {stats.pendingApprovals}
                </Badge>
              )}
            </Tab>
            <Tab>User Management</Tab>
            <Tab>Property Management</Tab>
            <Tab>Reports</Tab>
          </TabList>

          <TabPanels>
            {/* Pending Approvals Tab */}
            <TabPanel px={0} pt={6}>
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                <Card>
                  <CardBody>
                    <VStack align="start" spacing={4}>
                      <HStack justify="space-between" w="full">
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="600">Owner Verifications</Text>
                          <Text fontSize="sm" color="gray.600">
                            5 pending verifications
                          </Text>
                        </VStack>
                        <Icon as={FiAlertCircle} boxSize={6} color="yellow.500" />
                      </HStack>
                      <Button size="sm" colorScheme="primary" w="full" borderRadius="8px">
                        Review Verifications
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody>
                    <VStack align="start" spacing={4}>
                      <HStack justify="space-between" w="full">
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="600">Property Approvals</Text>
                          <Text fontSize="sm" color="gray.600">
                            7 properties awaiting approval
                          </Text>
                        </VStack>
                        <Icon as={FiHome} boxSize={6} color="blue.500" />
                      </HStack>
                      <Button size="sm" colorScheme="primary" w="full" borderRadius="8px">
                        Review Properties
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody>
                    <VStack align="start" spacing={4}>
                      <HStack justify="space-between" w="full">
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="600">Reported Content</Text>
                          <Text fontSize="sm" color="gray.600">
                            3 reports to review
                          </Text>
                        </VStack>
                        <Icon as={FiAlertCircle} boxSize={6} color="red.500" />
                      </HStack>
                      <Button size="sm" colorScheme="primary" w="full" borderRadius="8px">
                        Review Reports
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody>
                    <VStack align="start" spacing={4}>
                      <HStack justify="space-between" w="full">
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="600">Active Chats</Text>
                          <Text fontSize="sm" color="gray.600">
                            {stats.activeChats} ongoing conversations
                          </Text>
                        </VStack>
                        <Icon as={FiMessageSquare} boxSize={6} color="purple.500" />
                      </HStack>
                      <Button size="sm" variant="outline" w="full" borderRadius="8px">
                        Monitor Chats
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              </SimpleGrid>
            </TabPanel>

            {/* User Management Tab */}
            <TabPanel px={0} pt={6}>
              <Card>
                <CardBody>
                  <VStack spacing={4} py={8}>
                    <Icon as={FiUsers} boxSize={16} color="gray.300" />
                    <VStack spacing={1}>
                      <Text fontWeight="500" color="gray.600">
                        User Management
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        User management features coming soon
                      </Text>
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>

            {/* Property Management Tab */}
            <TabPanel px={0} pt={6}>
              <Card>
                <CardBody>
                  <VStack spacing={4} py={8}>
                    <Icon as={FiHome} boxSize={16} color="gray.300" />
                    <VStack spacing={1}>
                      <Text fontWeight="500" color="gray.600">
                        Property Management
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        Property management features coming soon
                      </Text>
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>

            {/* Reports Tab */}
            <TabPanel px={0} pt={6}>
              <Card>
                <CardBody>
                  <VStack spacing={4} py={8}>
                    <Icon as={FiCheckCircle} boxSize={16} color="gray.300" />
                    <VStack spacing={1}>
                      <Text fontWeight="500" color="gray.600">
                        Reports & Analytics
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        Reporting features coming soon
                      </Text>
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
