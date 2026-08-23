import { Box, VStack, HStack, Text, Icon, Badge, Divider, Button } from '@chakra-ui/react';
import { FiUser, FiMail, FiPhone, FiHome, FiMessageSquare } from 'react-icons/fi';
import SidePanel from '../../../../shared/components/SidePanel';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0 }).format(price);

const formatDate = (dateString) =>
  dateString ? new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

/** Read-only tenant detail panel, opened from a tenant roster row's context menu. */
const TenantDetailPanel = ({ isOpen, onClose, booking }) => {
  if (!booking) return null;
  const isActive = booking.status === 'confirmed';

  return (
    <SidePanel isOpen={isOpen} onClose={onClose} title="Tenant Details" icon={FiUser}>
      <VStack align="stretch" spacing={5}>
        <HStack justify="space-between" align="start">
          <VStack align="start" spacing={1}>
            <Text fontWeight="600">{booking.guestName}</Text>
            <Text fontSize="xs" color="gray.500">Booking ID: {booking.id}</Text>
          </VStack>
          <Badge colorScheme={isActive ? 'green' : 'gray'}>{isActive ? 'Active' : 'Completed'}</Badge>
        </HStack>

        <Divider />

        <VStack align="start" spacing={1}>
          <HStack><Icon as={FiMail} color="gray.500" boxSize={3} /><Text fontSize="sm">{booking.guestEmail}</Text></HStack>
          <HStack><Icon as={FiPhone} color="gray.500" boxSize={3} /><Text fontSize="sm">{booking.guestPhone}</Text></HStack>
          <HStack><Icon as={FiHome} color="gray.500" boxSize={3} /><Text fontSize="sm">{booking.propertyTitle}</Text></HStack>
        </VStack>

        <Box>
          <Text fontSize="xs" color="gray.500" mb={1}>Lease Dates</Text>
          <Text fontSize="sm" fontWeight="600">{formatDate(booking.checkIn)} – {formatDate(booking.checkOut)}</Text>
        </Box>

        <Box>
          <Text fontSize="xs" color="gray.500" mb={1}>Amount Paid</Text>
          <Text fontSize="lg" fontWeight="bold" color="primary.600">{formatPrice(booking.totalWithDeposit ?? booking.totalAmount)}</Text>
        </Box>

        <Button leftIcon={<Icon as={FiMessageSquare} />} as="a" href={`mailto:${booking.guestEmail}`} colorScheme="primary" variant="outline">
          Email Tenant
        </Button>
      </VStack>
    </SidePanel>
  );
};

export default TenantDetailPanel;
