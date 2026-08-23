import {
  Box,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Textarea,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
  Text,
  VStack,
  HStack,
  Icon,
  Alert,
  AlertIcon,
  AlertDescription,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiPlus, FiEye, FiCheckCircle, FiXCircle, FiDollarSign, FiSlash } from 'react-icons/fi';
import { Card } from '../../../shared/components';
import useBookingStore, { BOOKING_STATUS } from '../../../shared/stores/useBookingStore';
import { BookingStatusBadge } from '../../../domains/bookings/components';
import { useAuth } from '../../../app/providers/AuthProvider';
import useRentalStore from '../../../shared/stores/useRentalStore';
import PageBanner from '../../../shared/components/PageBanner';
import DataTable from '../../../shared/components/DataTable';
import TableToolbar from '../../../shared/components/TableToolbar';
import { TableSkeleton } from '../../../shared/components/LoadingState';
import { useMinDisplayTime } from '../../../shared/hooks/useMinDisplayTime';
import { useAppToast } from '../../../shared/hooks/useAppToast';
import { confirmAction } from '../../../shared/utils/confirm';
import ManualBookingPanel from './components/ManualBookingPanel';
import BookingDetailPanel from './components/BookingDetailPanel';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0 }).format(price);

const formatDate = (dateString) =>
  dateString ? new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

const BookingRequestsPage = () => {
  const toast = useAppToast();
  const { user } = useAuth();
  const isLoading = useMinDisplayTime();

  const { isOpen: isApproveOpen, onOpen: onApproveOpen, onClose: onApproveClose } = useDisclosure();
  const { isOpen: isRejectOpen, onOpen: onRejectOpen, onClose: onRejectClose } = useDisclosure();
  const { isOpen: isCancelOpen, onOpen: onCancelOpen, onClose: onCancelClose } = useDisclosure();
  const { isOpen: isManualOpen, onOpen: onManualOpen, onClose: onManualClose } = useDisclosure();
  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure();

  const { getBookingsByOwnerEmail, approveBooking, rejectBooking, verifyPayment, cancelBooking } = useBookingStore();
  const rentals = useRentalStore((state) => state.rentals) || [];
  const ownerProperties = rentals.filter((r) => r.ownerEmail === user?.email);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [ownerNotes, setOwnerNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [cancellationReason, setCancellationReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const ownerBookings = user ? getBookingsByOwnerEmail(user.email) : [];
  const allBookings = ownerBookings.filter(
    (b) =>
      !searchQuery ||
      b.propertyTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.guestName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingBookings = allBookings.filter((b) => b.status === BOOKING_STATUS.PENDING);
  const approvedBookings = allBookings.filter((b) => b.status === BOOKING_STATUS.APPROVED);
  const paidBookings = allBookings.filter((b) => b.status === BOOKING_STATUS.PAID);
  const activeBookings = allBookings.filter(
    (b) => b.status === BOOKING_STATUS.CONFIRMED || b.status === BOOKING_STATUS.COMPLETED
  );

  const openApprove = (booking) => { setSelectedBooking(booking); onApproveOpen(); };
  const openReject = (booking) => { setSelectedBooking(booking); onRejectOpen(); };
  const openCancel = (booking) => { setSelectedBooking(booking); onCancelOpen(); };
  const openDetail = (booking) => { setSelectedBooking(booking); onDetailOpen(); };

  const handleApprove = async () => {
    if (!selectedBooking) return;
    setIsProcessing(true);
    try {
      approveBooking(selectedBooking.id, ownerNotes);
      toast({ title: 'Booking Approved', description: 'The tenant has been notified and can proceed to payment.', status: 'success' });
      onApproveClose();
      setOwnerNotes('');
      setSelectedBooking(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedBooking || !rejectionReason.trim()) {
      toast({ title: 'Reason Required', description: 'Please provide a reason for rejection', status: 'warning' });
      return;
    }
    setIsProcessing(true);
    try {
      rejectBooking(selectedBooking.id, rejectionReason);
      toast({ title: 'Booking Rejected', description: 'The tenant has been notified.', status: 'info' });
      onRejectClose();
      setRejectionReason('');
      setSelectedBooking(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!selectedBooking || !cancellationReason.trim()) {
      toast({ title: 'Reason Required', description: 'Please provide a reason for cancelling this booking', status: 'warning' });
      return;
    }
    setIsProcessing(true);
    try {
      cancelBooking(selectedBooking.id, cancellationReason);
      toast({ title: 'Booking Cancelled', description: 'The tenant has been notified.', status: 'info' });
      onCancelClose();
      setCancellationReason('');
      setSelectedBooking(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerifyPayment = async (booking) => {
    const confirmed = await confirmAction({
      title: 'Verify Payment',
      text: `Confirm you received payment of ${formatPrice(booking.totalWithDeposit ?? booking.totalAmount)} for ${booking.propertyTitle}? This confirms the booking.`,
      confirmButtonText: 'Verify',
    });
    if (!confirmed) return;

    verifyPayment(booking.id, { verifiedBy: user.name, verifiedAt: new Date().toISOString() });
    toast({ title: 'Payment Verified', description: 'Booking is now confirmed.', status: 'success' });
  };

  const columns = [
    { key: 'propertyTitle', label: 'Property', sortable: true },
    { key: 'guestName', label: 'Tenant', sortable: true },
    { key: 'durationType', label: 'Duration', sortable: true, render: (b) => <Badge colorScheme="purple" fontSize="xs">{b.durationType}</Badge> },
    { key: 'checkIn', label: 'Check-in', sortable: true, render: (b) => formatDate(b.checkIn) },
    { key: 'totalAmount', label: 'Amount', sortable: true, render: (b) => formatPrice(b.totalWithDeposit ?? b.totalAmount) },
    { key: 'status', label: 'Status', sortable: true, render: (b) => <BookingStatusBadge status={b.status} /> },
  ];

  const getRowActions = (booking) => {
    const actions = [{ label: 'View Details', icon: FiEye, onClick: () => openDetail(booking) }];
    if (booking.status === BOOKING_STATUS.PENDING) {
      actions.push(
        { label: 'Approve', icon: FiCheckCircle, onClick: () => openApprove(booking) },
        { label: 'Reject', icon: FiXCircle, isDestructive: true, onClick: () => openReject(booking) }
      );
    }
    if (booking.status === BOOKING_STATUS.PAID) {
      actions.push({ label: 'Verify Payment', icon: FiDollarSign, onClick: () => handleVerifyPayment(booking) });
    }
    if (booking.status === BOOKING_STATUS.CONFIRMED) {
      actions.push({ label: 'Cancel Booking', icon: FiSlash, isDestructive: true, onClick: () => openCancel(booking) });
    }
    return actions;
  };

  const renderTable = (bookings, emptyLabel) =>
    isLoading ? (
      <TableSkeleton rows={4} columns={6} />
    ) : (
      <DataTable
        columns={columns}
        data={bookings}
        getRowKey={(b) => b.id}
        getRowActions={getRowActions}
        emptyState={emptyLabel}
      />
    );

  return (
    <Box>
      <PageBanner
        title="Bookings"
        subtitle="Manage booking requests and verify payments"
        actions={
          <Button leftIcon={<Icon as={FiPlus} />} colorScheme="primary" onClick={onManualOpen}>
            Add Manual Booking
          </Button>
        }
      />

      <TableToolbar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by property or tenant name..."
        hasFilters={false}
      />

      <Card borderRadius="lg" overflow="hidden">
        <Tabs colorScheme="primary" isLazy>
          <TabList px={6} pt={4}>
            <Tab>Pending{pendingBookings.length > 0 && <Badge ml={2} borderRadius="full" colorScheme="yellow">{pendingBookings.length}</Badge>}</Tab>
            <Tab>Approved{approvedBookings.length > 0 && <Badge ml={2} borderRadius="full" colorScheme="green">{approvedBookings.length}</Badge>}</Tab>
            <Tab>Awaiting Verification{paidBookings.length > 0 && <Badge ml={2} borderRadius="full" colorScheme="blue">{paidBookings.length}</Badge>}</Tab>
            <Tab>Active{activeBookings.length > 0 && <Badge ml={2} borderRadius="full" colorScheme="purple">{activeBookings.length}</Badge>}</Tab>
          </TabList>

          <TabPanels>
            <TabPanel p={6}>
              {renderTable(pendingBookings, 'No pending booking requests.')}
            </TabPanel>

            <TabPanel p={6}>
              {approvedBookings.length > 0 && (
                <Alert status="info" borderRadius="lg" mb={4}>
                  <AlertIcon />
                  <AlertDescription fontSize="sm">These bookings are approved and waiting for tenant payment.</AlertDescription>
                </Alert>
              )}
              {renderTable(approvedBookings, 'No approved bookings awaiting payment.')}
            </TabPanel>

            <TabPanel p={6}>
              {paidBookings.length > 0 && (
                <Alert status="warning" borderRadius="lg" mb={4}>
                  <AlertIcon />
                  <AlertDescription fontSize="sm">Right-click a booking to verify payment.</AlertDescription>
                </Alert>
              )}
              {renderTable(paidBookings, 'No payments to verify.')}
            </TabPanel>

            <TabPanel p={6}>
              {renderTable(activeBookings, 'No active bookings.')}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Card>

      {/* Approve Modal — has an optional notes field, stays a form */}
      <Modal isOpen={isApproveOpen} onClose={onApproveClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Approve Booking Request</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text fontSize="sm" color="gray.600">
                Approve this booking request? The tenant will be notified and can proceed to payment.
              </Text>
              {selectedBooking && (
                <Box bg="gray.50" p={4} borderRadius="lg">
                  <VStack align="start" spacing={2}>
                    <Text fontSize="sm" fontWeight="600">{selectedBooking.propertyTitle}</Text>
                    <Text fontSize="sm" color="gray.600">Tenant: {selectedBooking.guestName}</Text>
                    <Text fontSize="sm" color="gray.600">Amount: {formatPrice(selectedBooking.totalWithDeposit || selectedBooking.totalAmount)}</Text>
                  </VStack>
                </Box>
              )}
              <Box>
                <Text fontSize="sm" fontWeight="500" mb={2}>Notes for Tenant (Optional)</Text>
                <Textarea value={ownerNotes} onChange={(e) => setOwnerNotes(e.target.value)} placeholder="Add any special instructions or notes..." rows={3} />
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button variant="outline" onClick={onApproveClose}>Cancel</Button>
              <Button colorScheme="green" onClick={handleApprove} isLoading={isProcessing}>Approve Booking</Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Reject Modal — has a required reason field, stays a form */}
      <Modal isOpen={isRejectOpen} onClose={onRejectClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reject Booking Request</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text fontSize="sm" color="gray.600">Please provide a reason for rejecting this booking request.</Text>
              {selectedBooking && (
                <Box bg="gray.50" p={4} borderRadius="lg">
                  <VStack align="start" spacing={2}>
                    <Text fontSize="sm" fontWeight="600">{selectedBooking.propertyTitle}</Text>
                    <Text fontSize="sm" color="gray.600">Tenant: {selectedBooking.guestName}</Text>
                  </VStack>
                </Box>
              )}
              <Box>
                <Text fontSize="sm" fontWeight="500" mb={2}>Reason for Rejection *</Text>
                <Textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="e.g., Property is no longer available, dates are not suitable..." rows={4} />
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button variant="outline" onClick={onRejectClose}>Cancel</Button>
              <Button colorScheme="red" onClick={handleReject} isLoading={isProcessing}>Reject Booking</Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Cancel Modal — has a required reason field, stays a form */}
      <Modal isOpen={isCancelOpen} onClose={onCancelClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cancel Booking</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text fontSize="sm" color="gray.600">This booking is already confirmed. Please provide a reason for cancelling it.</Text>
              {selectedBooking && (
                <Box bg="gray.50" p={4} borderRadius="lg">
                  <VStack align="start" spacing={2}>
                    <Text fontSize="sm" fontWeight="600">{selectedBooking.propertyTitle}</Text>
                    <Text fontSize="sm" color="gray.600">Tenant: {selectedBooking.guestName}</Text>
                  </VStack>
                </Box>
              )}
              <Box>
                <Text fontSize="sm" fontWeight="500" mb={2}>Reason for Cancellation *</Text>
                <Textarea value={cancellationReason} onChange={(e) => setCancellationReason(e.target.value)} placeholder="e.g., Property is under maintenance, unforeseen circumstances..." rows={4} />
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button variant="outline" onClick={onCancelClose}>Keep Booking</Button>
              <Button colorScheme="red" onClick={handleCancel} isLoading={isProcessing}>Cancel Booking</Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <ManualBookingPanel
        isOpen={isManualOpen}
        onClose={onManualClose}
        properties={ownerProperties}
        ownerEmail={user?.email}
        ownerName={user?.name}
      />

      <BookingDetailPanel isOpen={isDetailOpen} onClose={onDetailClose} booking={selectedBooking} />
    </Box>
  );
};

export default BookingRequestsPage;
