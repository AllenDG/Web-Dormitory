import { Box, Heading, Text, VStack, HStack, Avatar, Badge, Icon, Button } from '@chakra-ui/react';
import { FiClock, FiCheckCircle, FiXCircle, FiAlertCircle } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { computeRecentActivity } from '../utils/ownerAnalytics';

const STATUS_CONFIG = {
  confirmed: { icon: FiCheckCircle, color: 'success.500', badge: 'green' },
  pending: { icon: FiClock, color: 'warning.500', badge: 'yellow' },
  cancelled: { icon: FiXCircle, color: 'error.500', badge: 'red' },
};

const TimelineItem = ({ activity, isLast }) => {
  const config = STATUS_CONFIG[activity.status] || { icon: FiAlertCircle, color: 'gray.500', badge: 'gray' };

  return (
    <HStack align="start" spacing={4} position="relative">
      {!isLast && <Box position="absolute" left="20px" top="40px" w="2px" h="calc(100% + 12px)" bg="gray.200" />}

      <Box position="relative" zIndex={1} bg="white" p={2} borderRadius="full" border="2px" borderColor={config.color}>
        <Icon as={config.icon} boxSize={5} color={config.color} />
      </Box>

      <Box flex={1} pb={6}>
        <HStack justify="space-between" mb={2}>
          <HStack spacing={3}>
            <Avatar size="sm" name={activity.tenant} />
            <Box>
              <Text fontWeight="semibold" fontSize="sm">{activity.tenant}</Text>
              <Text fontSize="xs" color="gray.500">{formatDistanceToNow(new Date(activity.date), { addSuffix: true })}</Text>
            </Box>
          </HStack>
          <Badge colorScheme={config.badge} fontSize="xs">{activity.status}</Badge>
        </HStack>
        <Text fontSize="sm" color="gray.700">{activity.action}</Text>
      </Box>
    </HStack>
  );
};

/** Bookings Timeline — real recent booking events, most recent first. */
const BookingsTimeline = ({ bookings }) => {
  const navigate = useNavigate();
  const recentActivities = computeRecentActivity(bookings, 6);

  return (
    <Box bg="white" p={6} borderRadius="lg" border="1px" borderColor="gray.200" boxShadow="sm">
      <HStack justify="space-between" mb={6}>
        <Box>
          <Heading size="md" mb={1}>Recent Activity</Heading>
          <Text fontSize="sm" color="gray.600">Latest booking updates</Text>
        </Box>
        <Button size="sm" variant="outline" colorScheme="primary" onClick={() => navigate('/owner/bookings')}>
          View All
        </Button>
      </HStack>

      {recentActivities.length === 0 ? (
        <Text color="gray.500" py={6} textAlign="center">No booking activity yet.</Text>
      ) : (
        <VStack align="stretch" spacing={0}>
          {recentActivities.map((activity, index) => (
            <TimelineItem key={activity.id} activity={activity} isLast={index === recentActivities.length - 1} />
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default BookingsTimeline;
