import {
  Box,
  Text,
  VStack,
  HStack,
  Badge,
  Button,
  SimpleGrid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Avatar,
  Textarea,
} from '@chakra-ui/react';
import { FiMail, FiCheckCircle, FiMessageSquare, FiSend, FiXCircle } from 'react-icons/fi';
import { useState } from 'react';
import useInquiryStore from '../../../../shared/stores/useInquiryStore';
import { useAuth } from '../../../../app/providers/AuthProvider';
import { useAppToast } from '../../../../shared/hooks/useAppToast';
import StatCard from '../../../../shared/components/StatCard';
import DataTable from '../../../../shared/components/DataTable';
import TableToolbar from '../../../../shared/components/TableToolbar';
import SidePanel from '../../../../shared/components/SidePanel';

const STATUS_COLORS = { new: 'blue', replied: 'green', closed: 'gray' };

const formatRelative = (dateString) => {
  const date = new Date(dateString);
  const diffMs = new Date() - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

/** Tenant inquiry inbox — DataTable standard, matching the rest of the app; reply moved from Modal to SidePanel. */
const InquiriesTab = () => {
  const toast = useAppToast();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [replyPanel, setReplyPanel] = useState({ isOpen: false, inquiry: null });
  const [replyMessage, setReplyMessage] = useState('');
  const allInquiries = useInquiryStore((state) => state.inquiries);
  const replyToInquiry = useInquiryStore((state) => state.replyToInquiry);
  const closeInquiry = useInquiryStore((state) => state.closeInquiry);

  const inquiries = allInquiries.filter((inq) => inq.ownerEmail === user?.email);

  const filteredInquiries = inquiries.filter(
    (inquiry) =>
      !searchQuery ||
      inquiry.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const newInquiries = filteredInquiries.filter((i) => i.status === 'new');
  const repliedInquiries = filteredInquiries.filter((i) => i.status === 'replied');
  const closedInquiries = filteredInquiries.filter((i) => i.status === 'closed');

  const openReply = (inquiry) => {
    setReplyPanel({ isOpen: true, inquiry });
    setReplyMessage('');
  };
  const closeReplyPanel = () => setReplyPanel({ isOpen: false, inquiry: null });

  const handleSendReply = () => {
    if (!replyMessage.trim()) return;
    replyToInquiry(replyPanel.inquiry.id, replyMessage);
    toast({ title: 'Reply Sent', description: `Your message has been sent to ${replyPanel.inquiry.tenantName}.`, status: 'success' });
    closeReplyPanel();
  };

  const handleClose = (inquiry) => {
    closeInquiry(inquiry.id);
    toast({ title: 'Inquiry Closed', description: `Marked the inquiry from ${inquiry.tenantName} as closed.`, status: 'info' });
  };

  const columns = [
    {
      key: 'tenantName',
      label: 'Inquirer',
      sortable: true,
      render: (i) => (
        <HStack>
          <Avatar size="sm" name={i.tenantName} bg="primary.500" />
          <Text fontWeight="semibold" fontSize="sm">{i.tenantName}</Text>
        </HStack>
      ),
    },
    { key: 'propertyTitle', label: 'Property', sortable: true },
    { key: 'message', label: 'Message', render: (i) => <Text noOfLines={1} maxW="280px" fontSize="sm">{i.message}</Text> },
    { key: 'status', label: 'Status', sortable: true, render: (i) => <Badge colorScheme={STATUS_COLORS[i.status]} borderRadius="md">{i.status}</Badge> },
    { key: 'createdAt', label: 'Received', sortable: true, render: (i) => formatRelative(i.createdAt) },
  ];

  const getRowActions = (inquiry) => [
    ...(inquiry.status !== 'closed'
      ? [
          { label: 'Reply', icon: FiSend, onClick: () => openReply(inquiry) },
          { label: 'Close Inquiry', icon: FiXCircle, onClick: () => handleClose(inquiry) },
        ]
      : []),
  ];

  const renderTable = (data, emptyLabel) => (
    <DataTable columns={columns} data={data} getRowKey={(i) => i.id} getRowActions={getRowActions} emptyState={emptyLabel} />
  );

  return (
    <Box>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={6}>
        <StatCard label="New Inquiries" value={newInquiries.length} icon={FiMail} color="primary" />
        <StatCard label="Replied" value={repliedInquiries.length} icon={FiCheckCircle} color="success" />
        <StatCard label="Total Inquiries" value={inquiries.length} icon={FiMessageSquare} color="info" />
      </SimpleGrid>

      <TableToolbar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by tenant name, property, or message..."
        hasFilters={false}
      />

      <Tabs colorScheme="primary">
        <TabList>
          <Tab>New ({newInquiries.length})</Tab>
          <Tab>Replied ({repliedInquiries.length})</Tab>
          <Tab>Closed ({closedInquiries.length})</Tab>
        </TabList>
        <TabPanels>
          <TabPanel px={0} pt={6}>{renderTable(newInquiries, 'No new inquiries.')}</TabPanel>
          <TabPanel px={0} pt={6}>{renderTable(repliedInquiries, 'No replied inquiries.')}</TabPanel>
          <TabPanel px={0} pt={6}>{renderTable(closedInquiries, 'No closed inquiries.')}</TabPanel>
        </TabPanels>
      </Tabs>

      <SidePanel
        isOpen={replyPanel.isOpen}
        onClose={closeReplyPanel}
        title={`Reply to ${replyPanel.inquiry?.tenantName || ''}`}
        icon={FiSend}
        footer={
          <HStack spacing={3} w="full">
            <Button variant="outline" onClick={closeReplyPanel} flex={1}>Cancel</Button>
            <Button colorScheme="primary" onClick={handleSendReply} isDisabled={!replyMessage.trim()} flex={1}>Send Reply</Button>
          </HStack>
        }
      >
        <VStack align="stretch" spacing={4}>
          <Box bg="gray.50" p={4} borderRadius="lg">
            <Text fontSize="sm" color="gray.600" mb={2}>Original Message</Text>
            <Text fontSize="sm">{replyPanel.inquiry?.message}</Text>
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.600" mb={1}>Property</Text>
            <Text fontWeight="medium">{replyPanel.inquiry?.propertyTitle}</Text>
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.600" mb={2}>Your Reply</Text>
            <Textarea placeholder="Type your reply here..." value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} rows={6} />
          </Box>
        </VStack>
      </SidePanel>
    </Box>
  );
};

export default InquiriesTab;
