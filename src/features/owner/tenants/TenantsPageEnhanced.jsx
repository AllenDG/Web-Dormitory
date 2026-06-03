import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Icon,
  SimpleGrid,
  Container,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useBreakpointValue,
  Badge,
  Avatar,
  Input,
  InputGroup,
  InputLeftElement,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Textarea,
} from '@chakra-ui/react';
import { 
  FiUsers, 
  FiClock, 
  FiTrendingUp, 
  FiAlertCircle,
  FiSearch,
  FiMail,
  FiPhone,
  FiMessageSquare,
} from 'react-icons/fi';
import { useState } from 'react';
import ActiveTenantsList from './components/ActiveTenantsList';

/**
 * Enhanced Tenants Management Page
 * Week 13 - Owner Portal Enhancement
 * Combines active tenant management with inquiries
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
      transition="all 0.2s"
      _hover={{ boxShadow: 'md' }}
    >
      <HStack justify="space-between" mb={3}>
        <Box bg={`${color}.50`} p={3} borderRadius="lg">
          <Icon as={icon} boxSize={6} color={`${color}.600`} />
        </Box>
      </HStack>
      <VStack align="start" spacing={1}>
        <Text fontSize="sm" color="gray.600" fontWeight="medium">
          {label}
        </Text>
        <Text fontSize="3xl" fontWeight="bold" color="gray.900">
          {value}
        </Text>
        {trendValue && (
          <Text fontSize="xs" color={trend === 'up' ? 'success.500' : 'error.500'}>
            {trend === 'up' ? '↑' : '↓'} {trendValue} from last month
          </Text>
        )}
      </VStack>
    </Box>
  );
};

const InquiryCard = ({ inquiry, onReply }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'blue';
      case 'replied': return 'green';
      case 'closed': return 'gray';
      default: return 'gray';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <Box
      bg="white"
      p={6}
      borderRadius="lg"
      border="1px"
      borderColor="gray.200"
      transition="all 0.2s"
      _hover={{ boxShadow: 'md' }}
    >
      <VStack align="stretch" spacing={4}>
        <HStack justify="space-between">
          <HStack spacing={3}>
            <Avatar name={inquiry.tenant.name} size="md" bg="primary.500" />
            <VStack align="start" spacing={0}>
              <Text fontWeight="semibold">{inquiry.tenant.name}</Text>
              <Text fontSize="sm" color="gray.600">
                {formatDate(inquiry.createdAt)}
              </Text>
            </VStack>
          </HStack>
          <Badge colorScheme={getStatusColor(inquiry.status)} fontSize="sm" px={3} py={1}>
            {inquiry.status}
          </Badge>
        </HStack>

        <Box>
          <Text fontSize="sm" color="gray.600" mb={1}>Property</Text>
          <Text fontWeight="medium" fontSize="sm">{inquiry.property.title}</Text>
        </Box>

        <Box>
          <Text fontSize="sm" color="gray.600" mb={1}>Message</Text>
          <Text fontSize="sm">{inquiry.message}</Text>
        </Box>

        <VStack align="stretch" spacing={2}>
          <HStack fontSize="sm">
            <Icon as={FiMail} color="gray.500" />
            <Text>{inquiry.tenant.email}</Text>
          </HStack>
          <HStack fontSize="sm">
            <Icon as={FiPhone} color="gray.500" />
            <Text>{inquiry.tenant.phone}</Text>
          </HStack>
        </VStack>

        {inquiry.status !== 'closed' && (
          <Button
            leftIcon={<Icon as={FiMessageSquare} />}
            colorScheme="primary"
            size="sm"
            onClick={() => onReply(inquiry)}
          >
            Reply
          </Button>
        )}
      </VStack>
    </Box>
  );
};

const TenantsPageEnhanced = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const tabsSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');

  // Mock data
  const [inquiries, setInquiries] = useState([
    {
      id: 1,
      tenant: {
        name: 'Juan Dela Cruz',
        email: 'juan@example.com',
        phone: '+63 912 345 6789',
      },
      property: { title: 'Modern Studio Room' },
      message: 'Is this property still available?',
      status: 'new',
      createdAt: '2026-05-29T10:30:00',
    },
    {
      id: 2,
      tenant: {
        name: 'Maria Santos',
        email: 'maria@example.com',
        phone: '+63 912 345 6790',
      },
      property: { title: 'Premium Condo' },
      message: 'Does this property allow pets?',
      status: 'replied',
      createdAt: '2026-05-28T14:20:00',
    },
  ]);

  const stats = {
    totalTenants: 28,
    activeTenants: 25,
    pendingPayments: 3,
    overduePayments: 1,
  };

  const handleReply = (inquiry) => {
    setSelectedInquiry(inquiry);
    setReplyMessage('');
    onOpen();
  };

  const handleSendReply = () => {
    setInquiries(inquiries.map(inq => 
      inq.id === selectedInquiry.id ? { ...inq, status: 'replied' } : inq
    ));

    toast({
      title: 'Reply Sent',
      description: `Your message has been sent to ${selectedInquiry.tenant.name}.`,
      status: 'success',
      duration: 3000,
    });

    onClose();
  };

  const newInquiries = inquiries.filter(i => i.status === 'new');
  const repliedInquiries = inquiries.filter(i => i.status === 'replied');

  return (
    <Box bg="gray.50" minH="100vh" pb={8}>
      <Container maxW="container.xl" py={8}>
        <VStack align="start" spacing={6} mb={8}>
          <Box>
            <Heading size="lg" mb={2}>
              Tenant Management
            </Heading>
            <Text color="gray.600">
              Manage your tenants, inquiries, and communications
            </Text>
          </Box>
        </VStack>

        {/* Stats Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
          <StatCard
            label="Total Tenants"
            value={stats.totalTenants}
            icon={FiUsers}
            color="primary"
            trend="up"
            trendValue="+3"
          />
          <StatCard
            label="Active Tenants"
            value={stats.activeTenants}
            icon={FiTrendingUp}
            color="success"
            trend="up"
            trendValue="+2"
          />
          <StatCard
            label="Pending Payments"
            value={stats.pendingPayments}
            icon={FiClock}
            color="warning"
            trend="down"
            trendValue="-1"
          />
          <StatCard
            label="Overdue Payments"
            value={stats.overduePayments}
            icon={FiAlertCircle}
            color="error"
            trend="down"
            trendValue="-2"
          />
        </SimpleGrid>

        {/* Main Content Tabs */}
        <Box
          bg="white"
          borderRadius="lg"
          border="1px"
          borderColor="gray.200"
          boxShadow="sm"
          p={6}
        >
          <Tabs colorScheme="primary" size={tabsSize}>
            <TabList>
              <Tab>Active Tenants</Tab>
              <Tab>Inquiries ({newInquiries.length})</Tab>
              <Tab>Payment Tracking</Tab>
            </TabList>

            <TabPanels>
              {/* Active Tenants Tab */}
              <TabPanel px={0} py={6}>
                <ActiveTenantsList />
              </TabPanel>

              {/* Inquiries Tab */}
              <TabPanel px={0} py={6}>
                <VStack align="stretch" spacing={4}>
                  <InputGroup>
                    <InputLeftElement>
                      <Icon as={FiSearch} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      placeholder="Search inquiries..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </InputGroup>

                  {newInquiries.length > 0 ? (
                    <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                      {newInquiries.map((inquiry) => (
                        <InquiryCard
                          key={inquiry.id}
                          inquiry={inquiry}
                          onReply={handleReply}
                        />
                      ))}
                    </SimpleGrid>
                  ) : (
                    <Box
                      textAlign="center"
                      py={12}
                      bg="gray.50"
                      borderRadius="lg"
                    >
                      <VStack spacing={3}>
                        <Text fontSize="4xl">📬</Text>
                        <Heading size="md">No New Inquiries</Heading>
                        <Text color="gray.600">
                          New tenant inquiries will appear here
                        </Text>
                      </VStack>
                    </Box>
                  )}
                </VStack>
              </TabPanel>

              {/* Payment Tracking Tab */}
              <TabPanel px={0} py={6}>
                <Box
                  textAlign="center"
                  py={12}
                  bg="gray.50"
                  borderRadius="lg"
                >
                  <VStack spacing={3}>
                    <Text fontSize="4xl">💰</Text>
                    <Heading size="md">Payment Tracking</Heading>
                    <Text color="gray.600">
                      Monitor rent payments and payment history
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      (Coming Soon)
                    </Text>
                  </VStack>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>

        {/* Reply Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Reply to {selectedInquiry?.tenant.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack align="stretch" spacing={4}>
                <Box bg="gray.50" p={4} borderRadius="lg">
                  <Text fontSize="sm" color="gray.600" mb={2}>Original Message</Text>
                  <Text fontSize="sm">{selectedInquiry?.message}</Text>
                </Box>

                <Box>
                  <Text fontSize="sm" color="gray.600" mb={1}>Property</Text>
                  <Text fontWeight="medium">{selectedInquiry?.property.title}</Text>
                </Box>

                <Box>
                  <Text fontSize="sm" color="gray.600" mb={2}>Your Reply</Text>
                  <Textarea
                    placeholder="Type your reply here..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    rows={6}
                  />
                </Box>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="primary"
                onClick={handleSendReply}
                isDisabled={!replyMessage.trim()}
              >
                Send Reply
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
};

export default TenantsPageEnhanced;
