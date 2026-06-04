import { Badge } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { BOOKING_STATUS } from '../../../shared/stores/useBookingStore';

/**
 * Booking Status Badge Component
 * 
 * Displays booking status with appropriate color coding
 * 
 * @component
 */
const BookingStatusBadge = ({ status, size = 'md' }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case BOOKING_STATUS.PENDING:
        return {
          label: 'Pending Approval',
          colorScheme: 'yellow',
        };
      case BOOKING_STATUS.APPROVED:
        return {
          label: 'Approved',
          colorScheme: 'green',
        };
      case BOOKING_STATUS.REJECTED:
        return {
          label: 'Rejected',
          colorScheme: 'red',
        };
      case BOOKING_STATUS.PAID:
        return {
          label: 'Payment Received',
          colorScheme: 'blue',
        };
      case BOOKING_STATUS.CONFIRMED:
        return {
          label: 'Confirmed',
          colorScheme: 'green',
        };
      case BOOKING_STATUS.CANCELLED:
        return {
          label: 'Cancelled',
          colorScheme: 'gray',
        };
      case BOOKING_STATUS.COMPLETED:
        return {
          label: 'Completed',
          colorScheme: 'purple',
        };
      default:
        return {
          label: status,
          colorScheme: 'gray',
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge
      colorScheme={config.colorScheme}
      borderRadius="full"
      px={3}
      py={1}
      fontSize={size === 'sm' ? 'xs' : 'sm'}
      fontWeight="600"
      textTransform="capitalize"
    >
      {config.label}
    </Badge>
  );
};

BookingStatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['sm', 'md']),
};

export default BookingStatusBadge;
