import {
  Box,
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
import useInquiryStore from '../../../../shared/stores/useInquiryStore';
import { useAuth } from '../../../../app/providers/AuthProvider';
import { useAppToast } from '../../../../shared/hooks/useAppToast';

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
    <Box bg="white" p={6} borderRadius="lg" border="1px" borderColor="gray.200" transition="all 0.2s" _hover={{ boxShadow: 'md' }}>
      <VStack align="stretch" spacing={4}>
        <HStack justify="space-between">
          <HStack spacing={3}>
            <Avatar name={inquiry.tenantName} size="md" bg="primary.500" />
            <VStack align="start" spacing={0}>
              <Text fontWeight="semibold">{inquiry.tenantName}</Text>
              <Text fontSize="sm" color="gray.600">{formatDate(inquiry.createdAt)}</Text>
            </VStack>
          </HStack>
          <Badge colorScheme={getStatusColor(inquiry.status)} fontSize="sm" px={3} py={1}>{inquiry.status}</Badge>
        </HStack>

        <Box>
          <Text fontSize="sm" color="gray.600" mb={1}>Property</Text>
          <Text fontWeight="medium" fontSize="sm">{inquiry.propertyTitle}</Text>
        </Box>

        <Box>
          <Text fontSize="sm" color="gray.600" mb={1}>Message</Text>
          <Text fontSize="sm">{inquiry.message}</Text>
        </Box>

        <VStack align="stretch" spacing={2}>
          <HStack fontSize="sm"><Icon as={FiMail} color="gray.500" /><Text>{inquiry.tenantEmail}</Text></HStack>
          <HStack fontSize="sm"><Icon as={FiPhone} color="gray.500" /><Text>{inquiry.tenantPhone}</Text></HStack>
        </VStack>

        {inquiry.status !== 'closed' && (
          <Button leftIcon={<Icon as={FiMessageSquare} />} colorScheme="primary" size="sm" onClick={() => onReply(inquiry)}>
            Reply
          </Button>
        )}
      </VStack>
    </Box>
  );
};

const EmptyState = ({ emoji, title, description }) => (
  <Box bg="white" p={12} borderRadius="lg" textAlign="center" border="1px" borderColor="gray.200">
    <Text fontSize="4xl" mb={2}>{emoji}</Text>
    <Text fontWeight="semibold" mb={2}>{title}</Text>
    <Text color="gray.600" fontSize="sm">{description}</Text>
  </Box>
);

/** Tenant inquiry inbox — moved from the old TenantsPage essentially unchanged. */
const InquiriesTab = () => {
  const toast = useAppToast();
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
    toast({ title: 'Reply Sent', description: `Your message has been sent to ${selectedInquiry.tenantName}.`, status: 'success' });
    onClose();
    setSelectedInquiry(null);
    setReplyMessage('');
  };

  const filteredInquiries = inquiries.filter((inquiry) =>
    inquiry.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inquiry.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inquiry.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const newInquiries = filteredInquiries.filter((i) => i.status === 'new');
  const repliedInquiries = filteredInquiries.filter((i) => i.status === 'replied');
  const closedInquiries = filteredInquiries.filter((i) => i.status === 'closed');

  return (
    <Box>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <Box bg="white" p={6} borderRadius="lg" border="1px" borderColor="gray.200">
          <Text fontSize="sm" color="gray.600" mb={1}>New Inquiries</Text>
          <Text fontSize="3xl" fontWeight="bold" color="primary.600">{newInquiries.length}</Text>
        </Box>
        <Box bg="white" p={6} borderRadius="lg" border="1px" borderColor="gray.200">
          <Text fontSize="sm" color="gray.600" mb={1}>Replied</Text>
          <Text fontSize="3xl" fontWeight="bold" color="success.500">{repliedInquiries.length}</Text>
        </Box>
        <Box bg="white" p={6} borderRadius="lg" border="1px" borderColor="gray.200">
          <Text fontSize="sm" color="gray.600" mb={1}>Total This Month</Text>
          <Text fontSize="3xl" fontWeight="bold" color="gray.700">{inquiries.length}</Text>
        </Box>
      </SimpleGrid>

      <Box mb={6}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Icon as={FiSearch} color="gray.400" />
          </InputLeftElement>
          <Input placeholder="Search by tenant name, property, or message..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} bg="white" />
        </InputGroup>
      </Box>

      <Tabs colorScheme="primary">
        <TabList>
          <Tab>New ({newInquiries.length})</Tab>
          <Tab>Replied ({repliedInquiries.length})</Tab>
          <Tab>Closed ({closedInquiries.length})</Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0} pt={6}>
            {newInquiries.length > 0 ? (
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                {newInquiries.map((inquiry) => <InquiryCard key={inquiry.id} inquiry={inquiry} onReply={handleReply} />)}
              </SimpleGrid>
            ) : (
              <EmptyState emoji="📬" title="No New Inquiries" description="New tenant inquiries will appear here" />
            )}
          </TabPanel>

          <TabPanel px={0} pt={6}>
            {repliedInquiries.length > 0 ? (
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                {repliedInquiries.map((inquiry) => <InquiryCard key={inquiry.id} inquiry={inquiry} onReply={handleReply} />)}
              </SimpleGrid>
            ) : (
              <EmptyState emoji="✉️" title="No Replied Inquiries" description="Inquiries you've responded to will appear here" />
            )}
          </TabPanel>

          <TabPanel px={0} pt={6}>
            {closedInquiries.length > 0 ? (
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                {closedInquiries.map((inquiry) => <InquiryCard key={inquiry.id} inquiry={inquiry} onReply={handleReply} />)}
              </SimpleGrid>
            ) : (
              <EmptyState emoji="📋" title="No Closed Inquiries" description="Completed inquiries will appear here" />
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reply to {selectedInquiry?.tenantName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align="stretch" spacing={4}>
              <Box bg="gray.50" p={4} borderRadius="lg">
                <Text fontSize="sm" color="gray.600" mb={2}>Original Message</Text>
                <Text fontSize="sm">{selectedInquiry?.message}</Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>Property</Text>
                <Text fontWeight="medium">{selectedInquiry?.propertyTitle}</Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.600" mb={2}>Your Reply</Text>
                <Textarea placeholder="Type your reply here..." value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} rows={6} />
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button>
            <Button colorScheme="primary" onClick={handleSendReply} isDisabled={!replyMessage.trim()}>Send Reply</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default InquiriesTab;
