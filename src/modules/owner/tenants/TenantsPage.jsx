import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Button,
  Icon,
  SimpleGrid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
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
import { FiSearch, FiMail, FiPhone, FiMessageSquare } from 'react-icons/fi';
import { useState } from 'react';
import useInquiryStore from '../../../shared/stores/useInquiryStore';
import { useAuth } from '../../../app/providers/AuthProvider';

/**
 * Tenants Management Page
 * Owner can view inquiries, manage communication, and track tenant interactions
 */

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
        {/* Header */}
        <HStack justify="space-between">
          <HStack spacing={3}>
            <Avatar name={inquiry.tenantName} size="md" bg="primary.500" />
            <VStack align="start" spacing={0}>
              <Text fontWeight="semibold">{inquiry.tenantName}</Text>
              <Text fontSize="sm" color="gray.600">
                {formatDate(inquiry.createdAt)}
              </Text>
            </VStack>
          </HStack>
          <Badge colorScheme={getStatusColor(inquiry.status)} fontSize="sm" px={3} py={1}>
            {inquiry.status}
          </Badge>
        </HStack>

        {/* Property */}
        <Box>
          <Text fontSize="sm" color="gray.600" mb={1}>Property</Text>
          <Text fontWeight="medium" fontSize="sm">{inquiry.propertyTitle}</Text>
        </Box>

        {/* Message */}
        <Box>
          <Text fontSize="sm" color="gray.600" mb={1}>Message</Text>
          <Text fontSize="sm">{inquiry.message}</Text>
        </Box>

        {/* Contact Info */}
        <VStack align="stretch" spacing={2}>
          <HStack fontSize="sm">
            <Icon as={FiMail} color="gray.500" />
            <Text>{inquiry.tenantEmail}</Text>
          </HStack>
          <HStack fontSize="sm">
            <Icon as={FiPhone} color="gray.500" />
            <Text>{inquiry.tenantPhone}</Text>
          </HStack>
        </VStack>

        {/* Actions */}
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

const TenantsPage = () => {
  const toast = useToast();
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const allInquiries = useInquiryStore((state) => state.inquiries);
  const replyToInquiry = useInquiryStore((state) => state.replyToInquiry);

  const inquiries = allInquiries.filter((inq) => inq.ownerEmail === user?.email);

  const handleReply = (inquiry) => {
    setSelectedInquiry(inquiry);
    setReplyMessage('');
    onOpen();
  };

  const handleSendReply = () => {
    replyToInquiry(selectedInquiry.id, replyMessage);

    toast({
      title: 'Reply Sent',
      description: `Your message has been sent to ${selectedInquiry.tenantName}.`,
      status: 'success',
      duration: 3000,
    });

    onClose();
    setSelectedInquiry(null);
    setReplyMessage('');
  };

  const filteredInquiries = inquiries.filter(inquiry =>
    inquiry.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inquiry.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inquiry.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const newInquiries = filteredInquiries.filter(i => i.status === 'new');
  const repliedInquiries = filteredInquiries.filter(i => i.status === 'replied');
  const closedInquiries = filteredInquiries.filter(i => i.status === 'closed');

  return (
    <Box>
      {/* Page Header */}
      <VStack align="start" spacing={2} mb={8}>
        <Heading size="lg">Tenant Inquiries</Heading>
        <Text color="gray.600">
          Manage communication with potential tenants
        </Text>
      </VStack>

      {/* Stats */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <Box bg="white" p={6} borderRadius="lg" border="1px" borderColor="gray.200">
          <Text fontSize="sm" color="gray.600" mb={1}>New Inquiries</Text>
          <Text fontSize="3xl" fontWeight="bold" color="primary.600">
            {newInquiries.length}
          </Text>
        </Box>
        <Box bg="white" p={6} borderRadius="lg" border="1px" borderColor="gray.200">
          <Text fontSize="sm" color="gray.600" mb={1}>Replied</Text>
          <Text fontSize="3xl" fontWeight="bold" color="success.500">
            {repliedInquiries.length}
          </Text>
        </Box>
        <Box bg="white" p={6} borderRadius="lg" border="1px" borderColor="gray.200">
          <Text fontSize="sm" color="gray.600" mb={1}>Total This Month</Text>
          <Text fontSize="3xl" fontWeight="bold" color="gray.700">
            {inquiries.length}
          </Text>
        </Box>
      </SimpleGrid>

      {/* Search */}
      <Box mb={6}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Icon as={FiSearch} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search by tenant name, property, or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            bg="white"
          />
        </InputGroup>
      </Box>

      {/* Tabs */}
      <Tabs colorScheme="primary">
        <TabList>
          <Tab>
            New ({newInquiries.length})
          </Tab>
          <Tab>
            Replied ({repliedInquiries.length})
          </Tab>
          <Tab>
            Closed ({closedInquiries.length})
          </Tab>
        </TabList>

        <TabPanels>
          {/* New Tab */}
          <TabPanel px={0} pt={6}>
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
                bg="white"
                p={12}
                borderRadius="lg"
                textAlign="center"
                border="1px"
                borderColor="gray.200"
              >
                <Text fontSize="4xl" mb={2}>📬</Text>
                <Text fontWeight="semibold" mb={2}>No New Inquiries</Text>
                <Text color="gray.600" fontSize="sm">
                  New tenant inquiries will appear here
                </Text>
              </Box>
            )}
          </TabPanel>

          {/* Replied Tab */}
          <TabPanel px={0} pt={6}>
            {repliedInquiries.length > 0 ? (
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                {repliedInquiries.map((inquiry) => (
                  <InquiryCard
                    key={inquiry.id}
                    inquiry={inquiry}
                    onReply={handleReply}
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
                <Text fontSize="4xl" mb={2}>✉️</Text>
                <Text fontWeight="semibold" mb={2}>No Replied Inquiries</Text>
                <Text color="gray.600" fontSize="sm">
                  Inquiries you&apos;ve responded to will appear here
                </Text>
              </Box>
            )}
          </TabPanel>

          {/* Closed Tab */}
          <TabPanel px={0} pt={6}>
            {closedInquiries.length > 0 ? (
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                {closedInquiries.map((inquiry) => (
                  <InquiryCard
                    key={inquiry.id}
                    inquiry={inquiry}
                    onReply={handleReply}
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
                <Text fontSize="4xl" mb={2}>📋</Text>
                <Text fontWeight="semibold" mb={2}>No Closed Inquiries</Text>
                <Text color="gray.600" fontSize="sm">
                  Completed inquiries will appear here
                </Text>
              </Box>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Reply Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reply to {selectedInquiry?.tenantName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align="stretch" spacing={4}>
              {/* Original Message */}
              <Box bg="gray.50" p={4} borderRadius="lg">
                <Text fontSize="sm" color="gray.600" mb={2}>Original Message</Text>
                <Text fontSize="sm">{selectedInquiry?.message}</Text>
              </Box>

              {/* Property Info */}
              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>Property</Text>
                <Text fontWeight="medium">{selectedInquiry?.propertyTitle}</Text>
              </Box>

              {/* Reply Textarea */}
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
    </Box>
  );
};

export default TenantsPage;
