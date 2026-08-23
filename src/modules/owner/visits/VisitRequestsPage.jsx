import {
  Box,
  Badge,
  Text,
  VStack,
  HStack,
  Flex,
  Select,
  Input,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  SimpleGrid,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiEye, FiCheckCircle, FiXCircle, FiClock, FiCalendar } from 'react-icons/fi';
import useVisitStore, { VISIT_STATUS } from '../../../shared/stores/useVisitStore';
import { useAuth } from '../../../app/providers/AuthProvider';
import PageBanner from '../../../shared/components/PageBanner';
import Button from '../../../shared/components/Button';
import StatCard from '../../../shared/components/StatCard';
import DataTable from '../../../shared/components/DataTable';
import TableToolbar from '../../../shared/components/TableToolbar';
import { useAppToast } from '../../../shared/hooks/useAppToast';
import { confirmAction } from '../../../shared/utils/confirm';
import VisitDetailPanel from './components/VisitDetailPanel';

const STATUS_COLORS = { pending: 'yellow', approved: 'green', rejected: 'red', rescheduled: 'blue', completed: 'gray', cancelled: 'red' };

/**
 * Visit Requests — useVisitStore.updateVisitStatus/suggestAlternativeSchedule
 * were fully implemented and doc-commented "(Owner action)" but had zero
 * owner-facing UI anywhere before this page.
 */
const VisitRequestsPage = () => {
  const toast = useAppToast();
  const { user } = useAuth();
  const { getVisits, updateVisitStatus, suggestAlternativeSchedule } = useVisitStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [altDate, setAltDate] = useState('');
  const [altTime, setAltTime] = useState('');
  const [altNotes, setAltNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure();
  const { isOpen: isRejectOpen, onOpen: onRejectOpen, onClose: onRejectClose } = useDisclosure();
  const { isOpen: isAltOpen, onOpen: onAltOpen, onClose: onAltClose } = useDisclosure();

  const allVisits = user ? getVisits(user.id, 'owner') : [];

  const visits = allVisits.filter((v) => {
    const matchesSearch =
      !searchQuery ||
      v.tenantName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.propertyTitle?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = allVisits.filter((v) => v.status === VISIT_STATUS.PENDING).length;
  const approvedCount = allVisits.filter((v) => v.status === VISIT_STATUS.APPROVED).length;

  const openDetail = (visit) => { setSelectedVisit(visit); onDetailOpen(); };
  const openReject = (visit) => { setSelectedVisit(visit); setRejectionReason(''); onRejectOpen(); };
  const openAlt = (visit) => { setSelectedVisit(visit); setAltDate(''); setAltTime(''); setAltNotes(''); onAltOpen(); };

  const handleApprove = async (visit) => {
    const confirmed = await confirmAction({
      title: 'Approve Visit Request',
      text: `Approve ${visit.tenantName}'s visit request for ${visit.propertyTitle} on ${visit.preferredDate}?`,
      confirmButtonText: 'Approve',
    });
    if (!confirmed) return;
    await updateVisitStatus(visit.id, VISIT_STATUS.APPROVED);
    toast({ title: 'Visit Approved', description: `${visit.tenantName} has been notified.`, status: 'success' });
  };

  const handleReject = async () => {
    if (!selectedVisit || !rejectionReason.trim()) {
      toast({ title: 'Reason Required', description: 'Please provide a reason for declining this visit request', status: 'warning' });
      return;
    }
    setIsProcessing(true);
    try {
      await updateVisitStatus(selectedVisit.id, VISIT_STATUS.REJECTED, rejectionReason);
      toast({ title: 'Visit Declined', description: `${selectedVisit.tenantName} has been notified.`, status: 'info' });
      onRejectClose();
      setSelectedVisit(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProposeAlternative = async () => {
    if (!selectedVisit || !altDate || !altTime) {
      toast({ title: 'Date and Time Required', status: 'warning' });
      return;
    }
    setIsProcessing(true);
    try {
      await suggestAlternativeSchedule(selectedVisit.id, altDate, altTime, altNotes);
      toast({ title: 'Alternative Proposed', description: `${selectedVisit.tenantName} can now accept the new time.`, status: 'success' });
      onAltClose();
      setSelectedVisit(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const columns = [
    { key: 'propertyTitle', label: 'Property', sortable: true },
    { key: 'tenantName', label: 'Tenant', sortable: true },
    { key: 'preferredDate', label: 'Requested Date', sortable: true },
    { key: 'preferredTime', label: 'Time', sortable: true },
    { key: 'status', label: 'Status', sortable: true, render: (v) => <Badge colorScheme={STATUS_COLORS[v.status] || 'gray'} borderRadius="md">{v.status}</Badge> },
  ];

  const getRowActions = (visit) => [
    { label: 'View Details', icon: FiEye, onClick: () => openDetail(visit) },
    ...(visit.status === VISIT_STATUS.PENDING
      ? [
          { label: 'Approve', icon: FiCheckCircle, onClick: () => handleApprove(visit) },
          { label: 'Propose Alternative Time', icon: FiClock, onClick: () => openAlt(visit) },
          { label: 'Decline', icon: FiXCircle, isDestructive: true, onClick: () => openReject(visit) },
        ]
      : []),
  ];

  return (
    <Box>
      <PageBanner title="Visit Requests" subtitle="Approve, decline, or reschedule tenant property visits" />

      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={6} mb={8}>
        <StatCard label="Pending" value={pendingCount} icon={FiClock} color="warning" />
        <StatCard label="Approved" value={approvedCount} icon={FiCalendar} color="success" />
      </SimpleGrid>

      <TableToolbar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by tenant name or property..."
        filtersOpen={filtersOpen}
        onToggleFilters={() => setFiltersOpen((prev) => !prev)}
      >
        <Flex wrap="wrap" gap={4}>
          <Select flex="1" minW={{ base: '100%', sm: '160px' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Declined</option>
            <option value="rescheduled">Rescheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </Select>
        </Flex>
      </TableToolbar>

      <DataTable
        columns={columns}
        data={visits}
        getRowKey={(v) => v.id}
        getRowActions={getRowActions}
        emptyState="No visit requests match your search or filters."
      />

      <VisitDetailPanel isOpen={isDetailOpen} onClose={onDetailClose} visit={selectedVisit} />

      {/* Decline Modal — has a required reason field, stays a form */}
      <Modal isOpen={isRejectOpen} onClose={onRejectClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Decline Visit Request</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text fontSize="sm" color="gray.600">Please provide a reason for declining this visit request.</Text>
              {selectedVisit && (
                <Box bg="gray.50" p={4} borderRadius="lg">
                  <VStack align="start" spacing={2}>
                    <Text fontSize="sm" fontWeight="600">{selectedVisit.propertyTitle}</Text>
                    <Text fontSize="sm" color="gray.600">Tenant: {selectedVisit.tenantName}</Text>
                  </VStack>
                </Box>
              )}
              <Box>
                <Text fontSize="sm" fontWeight="500" mb={2}>Reason *</Text>
                <Textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="e.g., Property is unavailable that day..." rows={4} />
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button variant="outline" onClick={onRejectClose}>Cancel</Button>
              <Button colorScheme="red" onClick={handleReject} isLoading={isProcessing}>Decline</Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Propose Alternative Modal — has required date/time fields, stays a form */}
      <Modal isOpen={isAltOpen} onClose={onAltClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Propose Alternative Time</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              {selectedVisit && (
                <Box bg="gray.50" p={4} borderRadius="lg">
                  <VStack align="start" spacing={2}>
                    <Text fontSize="sm" fontWeight="600">{selectedVisit.propertyTitle}</Text>
                    <Text fontSize="sm" color="gray.600">Tenant: {selectedVisit.tenantName}</Text>
                    <Text fontSize="sm" color="gray.600">Originally requested: {selectedVisit.preferredDate} at {selectedVisit.preferredTime}</Text>
                  </VStack>
                </Box>
              )}
              <HStack spacing={4}>
                <Box flex={1}>
                  <Text fontSize="sm" fontWeight="500" mb={2}>New Date *</Text>
                  <Input type="date" value={altDate} onChange={(e) => setAltDate(e.target.value)} />
                </Box>
                <Box flex={1}>
                  <Text fontSize="sm" fontWeight="500" mb={2}>New Time *</Text>
                  <Input type="time" value={altTime} onChange={(e) => setAltTime(e.target.value)} />
                </Box>
              </HStack>
              <Box>
                <Text fontSize="sm" fontWeight="500" mb={2}>Note for Tenant (Optional)</Text>
                <Textarea value={altNotes} onChange={(e) => setAltNotes(e.target.value)} placeholder="Let them know why you're proposing a new time..." rows={3} />
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button variant="outline" onClick={onAltClose}>Cancel</Button>
              <Button colorScheme="primary" onClick={handleProposeAlternative} isLoading={isProcessing}>Propose Time</Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default VisitRequestsPage;
