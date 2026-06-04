import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Avatar,
  Badge,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  SimpleGrid,
} from '@chakra-ui/react';
import {
  FiSearch,
  FiInbox,
  FiSend,
  FiArchive,
  FiStar,
  FiMessageSquare,
} from 'react-icons/fi';
import { useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

/**
 * Message Center Page
 * Centralized messaging hub
 * Week 15 - Notifications & Communication
 */

const MessageCard = ({ message, onClick }) => {
  return (
    <Box
      bg="white"
      p={5}
      borderRadius="lg"
      border="1px"
      borderColor="gray.200"
      cursor="pointer"
      onClick={onClick}
      transition="all 0.2s"
      _hover={{ boxShadow: 'md', transform: 'translateY(-2px)' }}
    >
      <HStack spacing={4} align="start">
        <Avatar name={message.sender} size="md" bg="primary.500" />

        <VStack align="start" spacing={1} flex={1} minW={0}>
          <HStack justify="space-between" w="full">
            <Text fontWeight="semibold" fontSize="sm" noOfLines={1}>
              {message.sender}
            </Text>
            {!message.read && (
              <Box
                w="10px"
                h="10px"
                borderRadius="full"
                bg="primary.500"
                flexShrink={0}
              />
            )}
          </HStack>

          <Text
            fontSize="sm"
            color="gray.800"
            fontWeight={message.read ? 'normal' : 'semibold'}
            noOfLines={1}
          >
            {message.subject}
          </Text>

          <Text fontSize="sm" color="gray.600" noOfLines={2}>
            {message.preview}
          </Text>

          <HStack spacing={3} fontSize="xs" color="gray.500">
            <Text>{format(new Date(message.timestamp), 'MMM d, h:mm a')}</Text>
            {message.property && (
              <Badge colorScheme="blue" fontSize="xs">
                {message.property}
              </Badge>
            )}
          </HStack>
        </VStack>
      </HStack>
    </Box>
  );
};

const StatCard = ({ icon, label, value, color }) => {
  return (
    <Box bg="white" p={5} borderRadius="lg" border="1px" borderColor="gray.200">
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

const MessageCenterPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const messages = [
    {
      id: 1,
      sender: 'Juan Dela Cruz',
      subject: 'Question about the property',
      preview: 'Hi, I have some questions about the amenities available...',
      timestamp: '2026-06-03T10:30:00',
      read: false,
      property: 'Modern Studio',
      type: 'inquiry',
    },
    {
      id: 2,
      sender: 'Maria Santos',
      subject: 'Booking confirmation needed',
      preview: 'Can you confirm my booking for next week? I need to...',
      timestamp: '2026-06-03T09:15:00',
      read: false,
      property: 'Premium Condo',
      type: 'inquiry',
    },
    {
      id: 3,
      sender: 'Pedro Garcia',
      subject: 'Payment received - Thank you!',
      preview: 'Your payment has been successfully processed...',
      timestamp: '2026-06-02T16:45:00',
      read: true,
      property: 'Cozy Room',
      type: 'sent',
    },
    {
      id: 4,
      sender: 'Ana Lopez',
      subject: 'Visit schedule update',
      preview: 'I would like to reschedule my property visit to...',
      timestamp: '2026-06-02T14:20:00',
      read: true,
      property: 'Deluxe Room',
      type: 'inquiry',
    },
  ];

  const filteredMessages = messages.filter(
    (msg) =>
      msg.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const inboxMessages = filteredMessages.filter((m) => m.type === 'inquiry');
  const sentMessages = filteredMessages.filter((m) => m.type === 'sent');
  const unreadCount = messages.filter((m) => !m.read).length;

  const handleMessageClick = (message) => {
    navigate(`/chat/${message.id}`);
  };

  return (
    <Box bg="gray.50" minH="100vh" py={8}>
      <Container maxW="container.xl">
        {/* Header */}
        <VStack align="start" spacing={2} mb={8}>
          <Heading size="lg">Message Center</Heading>
          <Text color="gray.600">
            Manage all your conversations in one place
          </Text>
        </VStack>

        {/* Stats */}
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4} mb={8}>
          <StatCard
            icon={FiInbox}
            label="Inbox"
            value={inboxMessages.length}
            color="primary"
          />
          <StatCard
            icon={FiMessageSquare}
            label="Unread"
            value={unreadCount}
            color="warning"
          />
          <StatCard
            icon={FiSend}
            label="Sent"
            value={sentMessages.length}
            color="success"
          />
          <StatCard
            icon={FiStar}
            label="Important"
            value={0}
            color="purple"
          />
        </SimpleGrid>

        {/* Search */}
        <Box mb={6}>
          <InputGroup>
            <InputLeftElement>
              <Icon as={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              bg="white"
            />
          </InputGroup>
        </Box>

        {/* Messages Tabs */}
        <Tabs colorScheme="primary">
          <TabList>
            <Tab>
              <HStack spacing={2}>
                <Icon as={FiInbox} />
                <Text>Inbox</Text>
                {unreadCount > 0 && (
                  <Badge colorScheme="primary" borderRadius="full">
                    {unreadCount}
                  </Badge>
                )}
              </HStack>
            </Tab>
            <Tab>
              <HStack spacing={2}>
                <Icon as={FiSend} />
                <Text>Sent</Text>
              </HStack>
            </Tab>
            <Tab>
              <HStack spacing={2}>
                <Icon as={FiArchive} />
                <Text>Archived</Text>
              </HStack>
            </Tab>
          </TabList>

          <TabPanels>
            {/* Inbox Tab */}
            <TabPanel px={0} py={6}>
              {inboxMessages.length > 0 ? (
                <VStack align="stretch" spacing={4}>
                  {inboxMessages.map((message) => (
                    <MessageCard
                      key={message.id}
                      message={message}
                      onClick={() => handleMessageClick(message)}
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
                    <Text fontSize="4xl">📬</Text>
                    <Heading size="md">No Messages</Heading>
                    <Text color="gray.600">
                      Your inbox is empty
                    </Text>
                  </VStack>
                </Box>
              )}
            </TabPanel>

            {/* Sent Tab */}
            <TabPanel px={0} py={6}>
              {sentMessages.length > 0 ? (
                <VStack align="stretch" spacing={4}>
                  {sentMessages.map((message) => (
                    <MessageCard
                      key={message.id}
                      message={message}
                      onClick={() => handleMessageClick(message)}
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
                    <Text fontSize="4xl">✉️</Text>
                    <Heading size="md">No Sent Messages</Heading>
                    <Text color="gray.600">
                      You haven't sent any messages yet
                    </Text>
                  </VStack>
                </Box>
              )}
            </TabPanel>

            {/* Archived Tab */}
            <TabPanel px={0} py={6}>
              <Box
                bg="white"
                p={12}
                borderRadius="lg"
                textAlign="center"
                border="1px"
                borderColor="gray.200"
              >
                <VStack spacing={3}>
                  <Text fontSize="4xl">📦</Text>
                  <Heading size="md">No Archived Messages</Heading>
                  <Text color="gray.600">
                    Archived messages will appear here
                  </Text>
                </VStack>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Box>
  );
};

export default MessageCenterPage;
