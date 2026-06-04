import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Image,
  Icon,
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
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
  SimpleGrid,
  Divider,
  Alert,
  AlertIcon,
  AlertDescription,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiCalendar,
  FiHome,
  FiMapPin,
  FiUser,
  FiMail,
  FiPhone,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiDollarSign,
} from 'react-icons/fi';
import { Card } from '../../../shared/components';
import useBookingStore, { BOOKING_STATUS } from '../../../shared/stores/useBookingStore';
import { BookingStatusBadge } from '../../../features/booking/components';
import { useAuth } from '../../../app/providers/AuthProvider';

/**
 * Owner Booking Requests Page
 * 
 * Allows owners to manage booking requests
 * Approve/reject bookings and verify payments
 * 
 * @component
 */
const BookingRequestsPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  
  const { isOpen: isApproveOpen, onOpen: onApproveOpen, onClose: onApproveClose } = useDisclosure();
  const { isOpen: isRejectOpen, onOpen: onRejectOpen, onClose: onRejectClose } = useDisclosure();
  const { isOpen: isVerifyOpen, onOpen: onVerifyOpen, onClose: onVerifyClose } = useDisclosure();
  
  const { getBookingsByOwner, approveBooking, rejectBooking, verifyPayment } = useBookingStore();
  
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [ownerNotes, setOwnerNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const allBookings = user ? getBookingsByOwner(user.id) : [];

  // Filter bookings
  const pendingBookings = allBookings.filter((b) => b.status === BOOKING_STATUS.PENDING);
  const approvedBookings = allBookings.filter((b) => b.status === BOOKING_STATUS.APPROVED);
  const paidBookings = allBookings.filter((b) => b.status === BOOKING_STATUS.PAID);
  const activeBookings = allBookings.filter(
    (b) => b.status === BOOKING_STATUS.CONFIRMED || b.status === BOOKING_STATUS.COMPLETED
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDurationLabel = (durationType) => {
    switch (durationType) {
      case 'daily':
        return 'Daily';
      case '6months':
        return '6 Months';
      case '1year':
        return '1 Year';
      default:
        return durationType;
    }
  };

  const handleApprove = async () => {
    if (!selectedBooking) return;

    setIsProcessing(true);
    try {
      approveBooking(selectedBooking.id, ownerNotes);
      
      toast({
        title: 'Booking Approved',
        description: 'The tenant has been notified and can proceed to payment.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      onApproveClose();
      setOwnerNotes('');
      setSelectedBooking(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedBooking || !rejectionReason.trim()) {
      toast({
        title: 'Reason Required',
        description: 'Please provide a reason for rejection',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsProcessing(true);
    try {
      rejectBooking(selectedBooking.id, rejectionReason);
      
      toast({
        title: 'Booking Rejected',
        description: 'The tenant has been notified.',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });

      onRejectClose();
      setRejectionReason('');
      setSelectedBooking(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerifyPayment = async () => {
    if (!selectedBooking) return;

    setIsProcessing(true);
    try {
      verifyPayment(selectedBooking.id, {
        verifiedBy: user.name,
        verifiedAt: new Date().toISOString(),
      });
      
      toast({
        title: 'Payment Verified',
        description: 'Booking is now confirmed. Contract is ready.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      onVerifyClose();
      setSelectedBooking(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Booking Card Component
  const BookingCard = ({ booking, showActions = true }) => (
    <Card p={6} borderRadius="8px">
      <VStack align="stretch" spacing={4}>
        {/* Header */}
        <HStack justify="space-between" align="start" flexWrap="wrap">
          <VStack align="start" spacing={1}>
            <HStack>
              <Icon as={FiHome} color="primary.600" boxSize={4} />
              <Heading fontSize="md" fontWeight="600">
                {booking.propertyTitle}
              </Heading>
            </HStack>
            <Text fontSize="xs" color="gray.500">
              Booking ID: {booking.id}
            </Text>
          </VStack>
          <BookingStatusBadge status={booking.status} />
        </HStack>

        <Divider />

        {/* Tenant Info */}
        <Box>
          <Text fontSize="sm" fontWeight="600" color="gray.900" mb={2}>
            Tenant Information
          </Text>
          <VStack align="start" spacing={1} pl={4}>
            <HStack>
              <Icon as={FiUser} color="gray.500" boxSize={3} />
              <Text fontSize="sm" color="gray.700">
                {booking.guestName}
              </Text>
            </HStack>
            <HStack>
              <Icon as={FiMail} color="gray.500" boxSize={3} />
              <Text fontSize="sm" color="gray.700">
                {booking.guestEmail}
              </Text>
            </HStack>
            <HStack>
              <Icon as={FiPhone} color="gray.500" boxSize={3} />
              <Text fontSize="sm" color="gray.700">
                {booking.guestPhone}
              </Text>
            </HStack>
          </VStack>
        </Box>

        {/* Booking Details */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          <VStack align="start" spacing={1}>
            <Text fontSize="xs" color="gray.500" fontWeight="500">
              Duration
            </Text>
            <Badge colorScheme="purple" fontSize="xs">
              {getDurationLabel(booking.durationType)}
            </Badge>
            <Text fontSize="xs" color="gray.600">
              {booking.priceBreakdown?.days || 0} days
            </Text>
          </VStack>

          <VStack align="start" spacing={1}>
            <Text fontSize="xs" color="gray.500" fontWeight="500">
              Check-in / Check-out
            </Text>
            <Text fontSize="sm" fontWeight="600">
              {formatDate(booking.checkIn)}
            </Text>
            <Text fontSize="sm" fontWeight="600">
              {formatDate(booking.checkOut)}
            </Text>
          </VStack>

          <VStack align="start" spacing={1}>
            <Text fontSize="xs" color="gray.500" fontWeight="500">
              Total Amount
            </Text>
            <Text fontSize="lg" fontWeight="bold" color="primary.600">
              {formatPrice(booking.totalWithDeposit || booking.totalAmount)}
            </Text>
            {booking.depositAmount && (
              <Text fontSize="xs" color="gray.600">
                Incl. {formatPrice(booking.depositAmount)} deposit
              </Text>
            )}
          </VStack>
        </SimpleGrid>

        {/* Special Requests */}
        {booking.specialRequests && (
          <Box bg="gray.50" p={3} borderRadius="8px">
            <Text fontSize="xs" fontWeight="600" color="gray.900" mb={1}>
              Special Requests:
            </Text>
            <Text fontSize="xs" color="gray.700">
              {booking.specialRequests}
            </Text>
          </Box>
        )}

        {/* Actions */}
        {showActions && (
          <>
            <Divider />
            <HStack spacing={3} justify="flex-end" flexWrap="wrap">
              {booking.status === BOOKING_STATUS.PENDING && (
                <>
                  <Button
                    leftIcon={<Icon as={FiCheckCircle} />}
                    size="sm"
                    colorScheme="green"
                    onClick={() => {
                      setSelectedBooking(booking);
                      onApproveOpen();
                    }}
                    borderRadius="8px"
                  >
                    Approve
                  </Button>
                  <Button
                    leftIcon={<Icon as={FiXCircle} />}
                    size="sm"
                    colorScheme="red"
                    variant="outline"
                    onClick={() => {
                      setSelectedBooking(booking);
                      onRejectOpen();
                    }}
                    borderRadius="8px"
                  >
                    Reject
                  </Button>
                </>
              )}
              {booking.status === BOOKING_STATUS.PAID && (
                <Button
                  leftIcon={<Icon as={FiDollarSign} />}
                  size="sm"
                  colorScheme="blue"
                  onClick={() => {
                    setSelectedBooking(booking);
                    onVerifyOpen();
                  }}
                  borderRadius="8px"
                >
                  Verify Payment
                </Button>
              )}
            </HStack>
          </>
        )}
      </VStack>
    </Card>
  );

  return (
    <Box>
      {/* Header */}
      <VStack spacing={4} mb={6} align="start">
        <Heading size="lg" color="gray.900">
          Booking Requests
        </Heading>
        <Text color="gray.600" fontSize="sm">
          Manage booking requests and verify payments
        </Text>
      </VStack>

      {/* Tabs */}
      <Card borderRadius="8px" overflow="hidden">
        <Tabs colorScheme="primary" isLazy>
          <TabList px={6} pt={4}>
            <Tab>
              Pending
              {pendingBookings.length > 0 && (
                <Badge ml={2} borderRadius="full" colorScheme="yellow">
                  {pendingBookings.length}
                </Badge>
              )}
            </Tab>
            <Tab>
              Approved
              {approvedBookings.length > 0 && (
                <Badge ml={2} borderRadius="full" colorScheme="green">
                  {approvedBookings.length}
                </Badge>
              )}
            </Tab>
            <Tab>
              Awaiting Verification
              {paidBookings.length > 0 && (
                <Badge ml={2} borderRadius="full" colorScheme="blue">
                  {paidBookings.length}
                </Badge>
              )}
            </Tab>
            <Tab>
              Active
              {activeBookings.length > 0 && (
                <Badge ml={2} borderRadius="full" colorScheme="purple">
                  {activeBookings.length}
                </Badge>
              )}
            </Tab>
          </TabList>

          <TabPanels>
            {/* Pending Tab */}
            <TabPanel p={6}>
              {pendingBookings.length === 0 ? (
                <VStack py={8} spacing={3}>
                  <Icon as={FiClock} boxSize={12} color="gray.300" />
                  <Text color="gray.500">No pending booking requests</Text>
                </VStack>
              ) : (
                <VStack spacing={4} align="stretch">
                  {pendingBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </VStack>
              )}
            </TabPanel>

            {/* Approved Tab */}
            <TabPanel p={6}>
              {approvedBookings.length === 0 ? (
                <VStack py={8} spacing={3}>
                  <Icon as={FiCheckCircle} boxSize={12} color="gray.300" />
                  <Text color="gray.500">No approved bookings awaiting payment</Text>
                </VStack>
              ) : (
                <>
                  <Alert status="info" borderRadius="8px" mb={4}>
                    <AlertIcon />
                    <AlertDescription fontSize="sm">
                      These bookings are approved and waiting for tenant payment
                    </AlertDescription>
                  </Alert>
                  <VStack spacing={4} align="stretch">
                    {approvedBookings.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} showActions={false} />
                    ))}
                  </VStack>
                </>
              )}
            </TabPanel>

            {/* Awaiting Verification Tab */}
            <TabPanel p={6}>
              {paidBookings.length === 0 ? (
                <VStack py={8} spacing={3}>
                  <Icon as={FiDollarSign} boxSize={12} color="gray.300" />
                  <Text color="gray.500">No payments to verify</Text>
                </VStack>
              ) : (
                <>
                  <Alert status="warning" borderRadius="8px" mb={4}>
                    <AlertIcon />
                    <AlertDescription fontSize="sm">
                      Please verify these payments to confirm the bookings
                    </AlertDescription>
                  </Alert>
                  <VStack spacing={4} align="stretch">
                    {paidBookings.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </VStack>
                </>
              )}
            </TabPanel>

            {/* Active Tab */}
            <TabPanel p={6}>
              {activeBookings.length === 0 ? (
                <VStack py={8} spacing={3}>
                  <Icon as={FiHome} boxSize={12} color="gray.300" />
                  <Text color="gray.500">No active bookings</Text>
                </VStack>
              ) : (
                <VStack spacing={4} align="stretch">
                  {activeBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} showActions={false} />
                  ))}
                </VStack>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Card>

      {/* Approve Modal */}
      <Modal isOpen={isApproveOpen} onClose={onApproveClose} size="md">
        <ModalOverlay />
        <ModalContent borderRadius="8px">
          <ModalHeader>Approve Booking Request</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text fontSize="sm" color="gray.600">
                Approve this booking request? The tenant will be notified and can proceed to
                payment.
              </Text>

              {selectedBooking && (
                <Box bg="gray.50" p={4} borderRadius="8px">
                  <VStack align="start" spacing={2}>
                    <Text fontSize="sm" fontWeight="600">
                      {selectedBooking.propertyTitle}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Tenant: {selectedBooking.guestName}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Amount: {formatPrice(selectedBooking.totalWithDeposit || selectedBooking.totalAmount)}
                    </Text>
                  </VStack>
                </Box>
              )}

              <Box>
                <Text fontSize="sm" fontWeight="500" mb={2}>
                  Notes for Tenant (Optional)
                </Text>
                <Textarea
                  value={ownerNotes}
                  onChange={(e) => setOwnerNotes(e.target.value)}
                  placeholder="Add any special instructions or notes..."
                  rows={3}
                  borderRadius="8px"
                />
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button variant="outline" onClick={onApproveClose} borderRadius="8px">
                Cancel
              </Button>
              <Button
                colorScheme="green"
                onClick={handleApprove}
                isLoading={isProcessing}
                borderRadius="8px"
              >
                Approve Booking
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Reject Modal */}
      <Modal isOpen={isRejectOpen} onClose={onRejectClose} size="md">
        <ModalOverlay />
        <ModalContent borderRadius="8px">
          <ModalHeader>Reject Booking Request</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text fontSize="sm" color="gray.600">
                Please provide a reason for rejecting this booking request.
              </Text>

              {selectedBooking && (
                <Box bg="gray.50" p={4} borderRadius="8px">
                  <VStack align="start" spacing={2}>
                    <Text fontSize="sm" fontWeight="600">
                      {selectedBooking.propertyTitle}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Tenant: {selectedBooking.guestName}
                    </Text>
                  </VStack>
                </Box>
              )}

              <Box>
                <Text fontSize="sm" fontWeight="500" mb={2}>
                  Reason for Rejection *
                </Text>
                <Textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g., Property is no longer available, dates are not suitable..."
                  rows={4}
                  borderRadius="8px"
                />
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button variant="outline" onClick={onRejectClose} borderRadius="8px">
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleReject}
                isLoading={isProcessing}
                borderRadius="8px"
              >
                Reject Booking
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Verify Payment Modal */}
      <Modal isOpen={isVerifyOpen} onClose={onVerifyClose} size="md">
        <ModalOverlay />
        <ModalContent borderRadius="8px">
          <ModalHeader>Verify Payment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text fontSize="sm" color="gray.600">
                Confirm that you have received the payment for this booking.
              </Text>

              {selectedBooking && (
                <Box bg="gray.50" p={4} borderRadius="8px">
                  <VStack align="start" spacing={2}>
                    <Text fontSize="sm" fontWeight="600">
                      {selectedBooking.propertyTitle}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Tenant: {selectedBooking.guestName}
                    </Text>
                    <Text fontSize="sm" fontWeight="600" color="primary.600">
                      Amount: {formatPrice(selectedBooking.totalWithDeposit || selectedBooking.totalAmount)}
                    </Text>
                  </VStack>
                </Box>
              )}

              <Alert status="warning" borderRadius="8px">
                <AlertIcon />
                <AlertDescription fontSize="xs">
                  Only verify payment after confirming receipt. This action will confirm the
                  booking and generate the rental contract.
                </AlertDescription>
              </Alert>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button variant="outline" onClick={onVerifyClose} borderRadius="8px">
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleVerifyPayment}
                isLoading={isProcessing}
                borderRadius="8px"
              >
                Verify Payment
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default BookingRequestsPage;
