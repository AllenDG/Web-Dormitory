import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Avatar,
  Badge,
  Icon,
  Button,
} from '@chakra-ui/react';
import { FiClock, FiCheckCircle, FiXCircle, FiAlertCircle } from 'react-icons/fi';

/**
 * Bookings Timeline Component
 * Displays recent booking activities with timeline view
 */

const TimelineItem = ({ booking, isLast }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return { icon: FiCheckCircle, color: 'success.500' };
      case 'pending':
        return { icon: FiClock, color: 'warning.500' };
      case 'cancelled':
        return { icon: FiXCircle, color: 'error.500' };
      default:
        return { icon: FiAlertCircle, color: 'gray.500' };
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'green';
      case 'pending':
        return 'yellow';
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
  };

  const statusConfig = getStatusIcon(booking.status);

  return (
    <HStack align="start" spacing={4} position="relative">
      {/* Timeline Line */}
      {!isLast && (
        <Box
          position="absolute"
          left="20px"
          top="40px"
          w="2px"
          h="calc(100% + 12px)"
          bg="gray.200"
        />
      )}

      {/* Icon */}
      <Box
        position="relative"
        zIndex={1}
        bg="white"
        p={2}
        borderRadius="full"
        border="2px"
        borderColor={statusConfig.color}
      >
        <Icon as={statusConfig.icon} boxSize={5} color={statusConfig.color} />
      </Box>

      {/* Content */}
      <Box flex={1} pb={6}>
        <HStack justify="space-between" mb={2}>
          <HStack spacing={3}>
            <Avatar size="sm" name={booking.tenant} />
            <Box>
              <Text fontWeight="semibold" fontSize="sm">
                {booking.tenant}
              </Text>
              <Text fontSize="xs" color="gray.500">
                {booking.time}
              </Text>
            </Box>
          </HStack>
          <Badge colorScheme={getStatusColor(booking.status)} fontSize="xs">
            {booking.status}
          </Badge>
        </HStack>
        <Text fontSize="sm" color="gray.700" mb={1}>
          {booking.action}
        </Text>
        <Text fontSize="xs" color="gray.500">
          {booking.property} • {booking.date}
        </Text>
      </Box>
    </HStack>
  );
};

const BookingsTimeline = () => {
  // Mock data - replace with actual API data
  const recentActivities = [
    {
      id: 1,
      tenant: 'Juan Dela Cruz',
      action: 'New booking request',
      property: 'Modern Studio Room',
      date: 'June 15, 2026',
      time: '2 hours ago',
      status: 'pending',
    },
    {
      id: 2,
      tenant: 'Maria Santos',
      action: 'Booking confirmed',
      property: 'Premium Condo Unit',
      date: 'June 20, 2026',
      time: '5 hours ago',
      status: 'confirmed',
    },
    {
      id: 3,
      tenant: 'Pedro Garcia',
      action: 'Check-in completed',
      property: 'Cozy Single Room',
      date: 'June 1, 2026',
      time: '1 day ago',
      status: 'confirmed',
    },
    {
      id: 4,
      tenant: 'Ana Lopez',
      action: 'Booking cancelled',
      property: 'Deluxe Double Room',
      date: 'June 10, 2026',
      time: '2 days ago',
      status: 'cancelled',
    },
    {
      id: 5,
      tenant: 'Carlos Reyes',
      action: 'Payment received',
      property: 'Budget Shared Room',
      date: 'June 5, 2026',
      time: '3 days ago',
      status: 'confirmed',
    },
  ];

  return (
    <Box
      bg="white"
      p={6}
      borderRadius="lg"
      border="1px"
      borderColor="gray.200"
      boxShadow="sm"
    >
      {/* Header */}
      <HStack justify="space-between" mb={6}>
        <Box>
          <Heading size="md" mb={1}>
            Recent Activities
          </Heading>
          <Text fontSize="sm" color="gray.600">
            Latest booking updates and actions
          </Text>
        </Box>
        <Button size="sm" variant="outline" colorScheme="primary">
          View All
        </Button>
      </HStack>

      {/* Timeline */}
      <VStack align="stretch" spacing={0}>
        {recentActivities.map((activity, index) => (
          <TimelineItem
            key={activity.id}
            booking={activity}
            isLast={index === recentActivities.length - 1}
          />
        ))}
      </VStack>
    </Box>
  );
};

export default BookingsTimeline;
