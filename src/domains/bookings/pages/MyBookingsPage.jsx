import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Image,
  Badge,
  Icon,
  SimpleGrid,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Textarea,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Alert,
  AlertIcon,
  AlertDescription,
  Divider,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiCalendar,
  FiHome,
  FiMapPin,
  FiEye,
  FiX,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiDollarSign,
  FiFileText,
} from 'react-icons/fi';
import { Button, Card } from '../../../shared/components';
import useBookingStore, { BOOKING_STATUS } from '../../../shared/stores/useBookingStore';
import { useAuth } from '../../../app/providers/AuthProvider';
import { BookingStatusBadge } from '../components';

/**
 * My Bookings Page Component
 * 
 * Displays all bookings for the logged-in tenant with tabs
 * 
 * Features:
 * - Tabbed interface (All, Pending, Active, Past)
 * - Booking status badges
 * - View booking details
 * - Cancel booking
 * - Payment status tracking
 * - Duration type display
 * 
 * @component
 */
const MyBookingsPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const { getBookingsByUser, cancelBooking } = useBookingStore();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  const allBookings = user ? getBookingsByUser(user.id) : [];

  // Filter bookings by category
  const pendingBookings = allBookings.filter(
    (b) => b.status === BOOKING_STATUS.PENDING
  );
  const activeBookings = allBookings.filter(
    (b) =>
      b.status === BOOKING_STATUS.APPROVED ||
      b.status === BOOKING_STATUS.PAID ||
      b.status === BOOKING_STATUS.CONFIRMED
  );
  const pastBookings = allBookings.filter(
    (b) =>
      b.status === BOOKING_STATUS.COMPLETED ||
      b.status === BOOKING_STATUS.CANCELLED ||
      b.status === BOOKING_STATUS.REJECTED
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

  const getNextAction = (booking) => {
    switch (booking.status) {
      case BOOKING_STATUS.PENDING:
        return {
          message: 'Waiting for owner approval',
          icon: FiClock,
          color: 'yellow',
        };
      case BOOKING_STATUS.APPROVED:
        return {
          message: 'Approved! Proceed to payment',
          icon: FiDollarSign,
          color: 'green',
          action: () => navigate(`/booking/${booking.id}/payment`),
          actionLabel: 'Pay Now',
        };
      case BOOKING_STATUS.PAID:
        return {
          message: 'Payment received, awaiting confirmation',
          icon: FiClock,
          color: 'blue',
        };
      case BOOKING_STATUS.CONFIRMED:
        return {
          message: 'Booking confirmed! Check your email for details',
          icon: FiCheckCircle,
          color: 'green',
        };
      case BOOKING_STATUS.REJECTED:
        return {
          message: booking.rejectionReason || 'Booking was rejected by owner',
          icon: FiXCircle,
          color: 'red',
        };
      case BOOKING_STATUS.CANCELLED:
        return {
          message: 'Booking cancelled',
          icon: FiXCircle,
          color: 'gray',
        };
      case BOOKING_STATUS.COMPLETED:
        return {
          message: 'Booking completed',
          icon: FiCheckCircle,
          color: 'purple',
        };
      default:
        return null;
    }
  };

  const handleCancelBooking = async () => {
    if (!cancellationReason.trim()) {
      toast({
        title: 'Reason Required',
        description: 'Please provide a reason for cancellation',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsCancelling(true);

    try {
      cancelBooking(selectedBooking.id, cancellationReason);

      toast({
        title: 'Booking Cancelled',
        description: 'Your booking has been cancelled successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      onClose();
      setCancellationReason('');
      setSelectedBooking(null);
    } catch (error) {
      toast({
        title: 'Cancellation Failed',
        description: error.message || 'An error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const canCancelBooking = (booking) => {
    return (
      booking.status === BOOKING_STATUS.PENDING ||
      booking.status === BOOKING_STATUS.APPROVED
    );
  };

  // Booking Card Component
  const BookingCard = ({ booking }) => {
    const nextAction = getNextAction(booking);

    return (
      <Card
        p={6}
        borderRadius="8px"
        transition="all 0.2s"
        _hover={{ boxShadow: 'lg', transform: 'translateY(-2px)' }}
      >
        <VStack align="stretch" spacing={4}>
          {/* Header with Image and Info */}
          <HStack spacing={4} align="start">
            <Image
              src={booking.propertyImage}
              alt={booking.propertyTitle}
              borderRadius="8px"
              objectFit="cover"
              w={{ base: '100px', md: '120px' }}
              h={{ base: '80px', md: '100px' }}
              flexShrink={0}
            />
            <VStack align="start" spacing={2} flex={1}>
              <HStack justify="space-between" w="full" flexWrap="wrap">
                <HStack>
                  <Icon as={FiHome} color="primary.600" boxSize={4} />
                  <Heading fontSize={{ base: 'md', md: 'lg' }} fontWeight="semibold">
                    {booking.propertyTitle}
                  </Heading>
                </HStack>
                <BookingStatusBadge status={booking.status} />
              </HStack>
              
              <HStack>
                <Icon as={FiMapPin} color="gray.500" boxSize={3} />
                <Text fontSize="sm" color="gray.600">
                  {booking.propertyAddress}
                </Text>
              </HStack>

              <HStack spacing={4} flexWrap="wrap">
                <HStack>
                  <Icon as={FiCalendar} color="gray.500" boxSize={3} />
                  <Text fontSize="xs" color="gray.600">
                    {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                  </Text>
                </HStack>
                {booking.durationType && (
                  <Badge colorScheme="purple" fontSize="xs" borderRadius="full">
                    {getDurationLabel(booking.durationType)}
                  </Badge>
                )}
              </HStack>

              <Text fontSize="xs" color="gray.500">
                Booking ID: {booking.id}
              </Text>
            </VStack>
          </HStack>

          <Divider />

          {/* Price and Details */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <VStack align="start" spacing={1}>
              <Text fontSize="xs" color="gray.500" fontWeight="500">
                Total Amount
              </Text>
              <Text fontSize="lg" fontWeight="bold" color="primary.600">
                {formatPrice(booking.totalAmount)}
              </Text>
              {booking.depositAmount && (
                <Text fontSize="xs" color="gray.500">
                  + {formatPrice(booking.depositAmount)} deposit
                </Text>
              )}
            </VStack>

            <VStack align="start" spacing={1}>
              <Text fontSize="xs" color="gray.500" fontWeight="500">
                Duration
              </Text>
              <Text fontSize="sm" fontWeight="600">
                {booking.priceBreakdown?.days || 0} days
              </Text>
              {booking.priceBreakdown?.discount > 0 && (
                <Badge colorScheme="green" fontSize="xs">
                  Saved {formatPrice(booking.priceBreakdown.discount)}
                </Badge>
              )}
            </VStack>

            <VStack align="start" spacing={1}>
              <Text fontSize="xs" color="gray.500" fontWeight="500">
                Booked On
              </Text>
              <Text fontSize="sm" fontWeight="600">
                {formatDate(booking.createdAt)}
              </Text>
            </VStack>
          </SimpleGrid>

          {/* Next Action Alert */}
          {nextAction && (
            <Alert
              status={nextAction.color}
              borderRadius="8px"
              variant="left-accent"
            >
              <AlertIcon as={nextAction.icon} />
              <AlertDescription fontSize="sm" flex={1}>
                {nextAction.message}
              </AlertDescription>
              {nextAction.action && (
                <Button
                  size="sm"
                  colorScheme={nextAction.color}
                  onClick={nextAction.action}
                  borderRadius="8px"
                  ml={2}
                >
                  {nextAction.actionLabel}
                </Button>
              )}
            </Alert>
          )}

          {/* Actions */}
          <HStack spacing={3} justify="flex-end" flexWrap="wrap">
            <Button
              leftIcon={<Icon as={FiEye} />}
              size="sm"
              variant="outline"
              borderRadius="8px"
              onClick={() => navigate(`/booking/${booking.id}/confirmation`)}
            >
              View Details
            </Button>
            {(booking.status === BOOKING_STATUS.CONFIRMED || booking.status === BOOKING_STATUS.COMPLETED) && (
              <Button
                leftIcon={<Icon as={FiFileText} />}
                size="sm"
                colorScheme="blue"
                variant="outline"
                borderRadius="8px"
                onClick={() => navigate(`/booking/${booking.id}/contract`)}
              >
                View Contract
              </Button>
            )}
            {canCancelBooking(booking) && (
              <Button
                leftIcon={<Icon as={FiX} />}
                size="sm"
                colorScheme="red"
                variant="outline"
                borderRadius="8px"
                onClick={() => {
                  setSelectedBooking(booking);
                  onOpen();
                }}
              >
                Cancel
              </Button>
            )}
          </HStack>
        </VStack>
      </Card>
    );
  };

  return (
    <Box minH="100vh" bg="gray.50" py={8}>
      <Box maxW="1200px" mx="auto" px={4}>
        {/* Header */}
        <VStack spacing={6} mb={8}>
          <Box bg="primary.600" p={4} borderRadius="8px" boxShadow="lg">
            <Icon as={FiCalendar} boxSize={8} color="white" />
          </Box>
          <VStack spacing={2}>
            <Heading fontSize="3xl" fontWeight="bold" color="gray.900">
              My Bookings
            </Heading>
            <Text fontSize="md" color="gray.600">
              View and manage your property bookings
            </Text>
          </VStack>
        </VStack>

        {/* Bookings List with Tabs */}
        {allBookings.length === 0 ? (
          <Card p={12} textAlign="center" borderRadius="8px">
            <VStack spacing={4}>
              <Icon as={FiCalendar} boxSize={16} color="gray.300" />
              <Heading fontSize="xl" color="gray.600">
                No Bookings Yet
              </Heading>
              <Text color="gray.500">
                Start exploring properties and make your first booking
              </Text>
              <Button
                colorScheme="primary"
                size="lg"
                borderRadius="8px"
                onClick={() => navigate('/find-rentals')}
                mt={4}
              >
                Browse Properties
              </Button>
            </VStack>
          </Card>
        ) : (
          <Card borderRadius="8px" overflow="hidden">
            <Tabs colorScheme="primary" isLazy>
              <TabList px={6} pt={4}>
                <Tab>
                  All
                  <Badge ml={2} borderRadius="full" colorScheme="gray">
                    {allBookings.length}
                  </Badge>
                </Tab>
                <Tab>
                  Pending
                  {pendingBookings.length > 0 && (
                    <Badge ml={2} borderRadius="full" colorScheme="yellow">
                      {pendingBookings.length}
                    </Badge>
                  )}
                </Tab>
                <Tab>
                  Active
                  {activeBookings.length > 0 && (
                    <Badge ml={2} borderRadius="full" colorScheme="green">
                      {activeBookings.length}
                    </Badge>
                  )}
                </Tab>
                <Tab>
                  Past
                  {pastBookings.length > 0 && (
                    <Badge ml={2} borderRadius="full" colorScheme="gray">
                      {pastBookings.length}
                    </Badge>
                  )}
                </Tab>
              </TabList>

              <TabPanels>
                {/* All Bookings Tab */}
                <TabPanel p={6}>
                  <VStack spacing={4} align="stretch">
                    {allBookings.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </VStack>
                </TabPanel>

                {/* Pending Bookings Tab */}
                <TabPanel p={6}>
                  {pendingBookings.length === 0 ? (
                    <VStack py={8} spacing={3}>
                      <Icon as={FiClock} boxSize={12} color="gray.300" />
                      <Text color="gray.500">No pending bookings</Text>
                    </VStack>
                  ) : (
                    <VStack spacing={4} align="stretch">
                      {pendingBookings.map((booking) => (
                        <BookingCard key={booking.id} booking={booking} />
                      ))}
                    </VStack>
                  )}
                </TabPanel>

                {/* Active Bookings Tab */}
                <TabPanel p={6}>
                  {activeBookings.length === 0 ? (
                    <VStack py={8} spacing={3}>
                      <Icon as={FiCheckCircle} boxSize={12} color="gray.300" />
                      <Text color="gray.500">No active bookings</Text>
                    </VStack>
                  ) : (
                    <VStack spacing={4} align="stretch">
                      {activeBookings.map((booking) => (
                        <BookingCard key={booking.id} booking={booking} />
                      ))}
                    </VStack>
                  )}
                </TabPanel>

                {/* Past Bookings Tab */}
                <TabPanel p={6}>
                  {pastBookings.length === 0 ? (
                    <VStack py={8} spacing={3}>
                      <Icon as={FiXCircle} boxSize={12} color="gray.300" />
                      <Text color="gray.500">No past bookings</Text>
                    </VStack>
                  ) : (
                    <VStack spacing={4} align="stretch">
                      {pastBookings.map((booking) => (
                        <BookingCard key={booking.id} booking={booking} />
                      ))}
                    </VStack>
                  )}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Card>
        )}

        {/* Cancellation Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
          <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
          <ModalContent borderRadius="8px" mx={4}>
            <ModalHeader>
              <HStack spacing={3}>
                <Box bg="red.100" p={2} borderRadius="8px">
                  <Icon as={FiX} boxSize={5} color="red.600" />
                </Box>
                <Text fontSize="lg" fontWeight="semibold">
                  Cancel Booking
                </Text>
              </HStack>
            </ModalHeader>
            <ModalCloseButton borderRadius="8px" />

            <ModalBody>
              <VStack spacing={4} align="stretch">
                <Text fontSize="sm" color="gray.600">
                  Are you sure you want to cancel this booking? This action cannot be undone.
                </Text>

                {selectedBooking && (
                  <Box bg="gray.50" p={4} borderRadius="8px">
                    <VStack align="start" spacing={2}>
                      <Text fontSize="sm" fontWeight="semibold">
                        {selectedBooking.propertyTitle}
                      </Text>
                      <Text fontSize="xs" color="gray.600">
                        {formatDate(selectedBooking.checkIn)} - {formatDate(selectedBooking.checkOut)}
                      </Text>
                      <Text fontSize="sm" fontWeight="bold" color="primary.600">
                        {formatPrice(selectedBooking.totalAmount)}
                      </Text>
                    </VStack>
                  </Box>
                )}

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>
                    Reason for Cancellation *
                  </Text>
                  <Textarea
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                    placeholder="Please provide a reason for cancelling this booking..."
                    rows={4}
                    borderRadius="8px"
                  />
                </Box>

                <Box bg="yellow.50" p={3} borderRadius="8px">
                  <Text fontSize="xs" color="gray.700">
                    <strong>Note:</strong> Refund processing may take 5-7 business days depending on your payment method.
                  </Text>
                </Box>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <HStack spacing={3}>
                <Button
                  variant="outline"
                  onClick={onClose}
                  borderRadius="8px"
                >
                  Keep Booking
                </Button>
                <Button
                  colorScheme="red"
                  onClick={handleCancelBooking}
                  isLoading={isCancelling}
                  loadingText="Cancelling..."
                  borderRadius="8px"
                >
                  Cancel Booking
                </Button>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
};

export default MyBookingsPage;
