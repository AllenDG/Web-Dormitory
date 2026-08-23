import { Box, VStack, HStack, Text, Icon, Badge, SimpleGrid, Divider } from '@chakra-ui/react';
import { FiHome, FiUser, FiMail, FiPhone } from 'react-icons/fi';
import SidePanel from '../../../../shared/components/SidePanel';
import { BookingStatusBadge } from '../../../../domains/bookings/components';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0 }).format(price);

const formatDate = (dateString) =>
  dateString ? new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

const DURATION_LABELS = { daily: 'Daily', '6months': '6 Months', '1year': '1 Year' };

/** Read-only booking detail panel, opened from a row's context menu. */
const BookingDetailPanel = ({ isOpen, onClose, booking }) => {
  if (!booking) return null;

  return (
    <SidePanel isOpen={isOpen} onClose={onClose} title="Booking Details" icon={FiHome}>
      <VStack align="stretch" spacing={5}>
        <HStack justify="space-between" align="start">
          <VStack align="start" spacing={1}>
            <Text fontWeight="600">{booking.propertyTitle}</Text>
            <Text fontSize="xs" color="gray.500">Booking ID: {booking.id}</Text>
          </VStack>
          <BookingStatusBadge status={booking.status} />
        </HStack>

        <Divider />

        <Box>
          <Text fontSize="sm" fontWeight="600" mb={2}>Tenant Information</Text>
          <VStack align="start" spacing={1} pl={2}>
            <HStack><Icon as={FiUser} color="gray.500" boxSize={3} /><Text fontSize="sm">{booking.guestName}</Text></HStack>
            <HStack><Icon as={FiMail} color="gray.500" boxSize={3} /><Text fontSize="sm">{booking.guestEmail}</Text></HStack>
            <HStack><Icon as={FiPhone} color="gray.500" boxSize={3} /><Text fontSize="sm">{booking.guestPhone}</Text></HStack>
          </VStack>
        </Box>

        <SimpleGrid columns={2} spacing={4}>
          <VStack align="start" spacing={1}>
            <Text fontSize="xs" color="gray.500">Duration</Text>
            <Badge colorScheme="purple" fontSize="xs">{DURATION_LABELS[booking.durationType] || booking.durationType}</Badge>
          </VStack>
          <VStack align="start" spacing={1}>
            <Text fontSize="xs" color="gray.500">Check-in / Check-out</Text>
            <Text fontSize="sm" fontWeight="600">{formatDate(booking.checkIn)} – {formatDate(booking.checkOut)}</Text>
          </VStack>
        </SimpleGrid>

        <Box>
          <Text fontSize="xs" color="gray.500" mb={1}>Total Amount</Text>
          <Text fontSize="lg" fontWeight="bold" color="primary.600">{formatPrice(booking.totalWithDeposit ?? booking.totalAmount)}</Text>
        </Box>

        {booking.specialRequests && (
          <Box bg="gray.50" p={3} borderRadius="lg">
            <Text fontSize="xs" fontWeight="600" mb={1}>Special Requests</Text>
            <Text fontSize="xs" color="gray.700">{booking.specialRequests}</Text>
          </Box>
        )}

        {booking.ownerNotes && (
          <Box bg="gray.50" p={3} borderRadius="lg">
            <Text fontSize="xs" fontWeight="600" mb={1}>Your Notes</Text>
            <Text fontSize="xs" color="gray.700">{booking.ownerNotes}</Text>
          </Box>
        )}

        {booking.rejectionReason && (
          <Box bg="error.50" p={3} borderRadius="lg">
            <Text fontSize="xs" fontWeight="600" mb={1} color="error.700">Rejection Reason</Text>
            <Text fontSize="xs" color="error.700">{booking.rejectionReason}</Text>
          </Box>
        )}
      </VStack>
    </SidePanel>
  );
};

export default BookingDetailPanel;
