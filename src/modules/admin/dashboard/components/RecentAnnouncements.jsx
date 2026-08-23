import { Box, VStack, HStack, Text, Badge, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import useAnnouncementStore from '../../../../shared/stores/useAnnouncementStore';

const SEVERITY_COLORS = { info: 'blue', success: 'green', warning: 'yellow', error: 'red' };
const AUDIENCE_LABELS = { all: 'Owners & Tenants', owners: 'Owners', tenants: 'Tenants' };

const formatDate = (iso) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

/** So Admin can see at a glance whether a maintenance/incident broadcast is currently live, without visiting the Announcements page. */
const RecentAnnouncements = () => {
  const announcements = useAnnouncementStore((state) => state.announcements);
  const recent = announcements.slice(0, 3);

  return (
    <Box bg="white" p={6} borderRadius="lg" border="1px" borderColor="gray.200">
      <HStack justify="space-between" mb={4}>
        <Text fontSize="lg" fontWeight="bold">Recent Announcements</Text>
        <Link as={RouterLink} to="/admin/notifications" fontSize="sm" color="primary.600" fontWeight="medium">
          View All
        </Link>
      </HStack>

      {recent.length === 0 ? (
        <Text color="gray.600" fontSize="sm" py={4} textAlign="center">No announcements sent yet.</Text>
      ) : (
        <VStack align="stretch" spacing={4}>
          {recent.map((a) => (
            <Box key={a.id}>
              <HStack justify="space-between" mb={1}>
                <Text fontWeight="medium" fontSize="sm">{a.title}</Text>
                <Badge colorScheme={SEVERITY_COLORS[a.severity]} borderRadius="md">{a.severity}</Badge>
              </HStack>
              <Text fontSize="xs" color="gray.600">
                {AUDIENCE_LABELS[a.audience]} · {formatDate(a.createdAt)}
              </Text>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default RecentAnnouncements;
