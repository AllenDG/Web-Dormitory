import {
  VStack,
  HStack,
  Avatar,
  Text,
  Badge,
  Divider,
  SimpleGrid,
  Box,
  Icon,
} from '@chakra-ui/react';
import { FiMail, FiCalendar, FiClock, FiHome, FiShoppingBag, FiUser } from 'react-icons/fi';
import SidePanel from '../../../../shared/components/SidePanel';

const InfoItem = ({ icon, label, value }) => (
  <HStack spacing={3} align="start">
    <Icon as={icon} boxSize={5} color="primary.500" mt={1} />
    <Box>
      <Text fontSize="xs" color="gray.500" mb={1}>{label}</Text>
      <Text fontSize="sm" fontWeight="medium">{value}</Text>
    </Box>
  </HStack>
);

const ROLE_COLORS = { owner: 'purple', tenant: 'blue', admin: 'red' };
const STATUS_COLORS = { active: 'green', suspended: 'red', inactive: 'gray' };

const UserDetailsPanel = ({ isOpen, onClose, user }) => {
  if (!user) return null;

  return (
    <SidePanel
      isOpen={isOpen}
      onClose={onClose}
      title="User Details"
      icon={FiUser}
      size="md"
    >
      <VStack spacing={6} align="stretch">
        <HStack spacing={4}>
          <Avatar size="xl" name={user.name} bg="primary.500" />
          <Box flex={1}>
            <Text fontSize="xl" fontWeight="bold" mb={1}>{user.name}</Text>
            <Text fontSize="sm" color="gray.600" mb={2}>{user.email}</Text>
            <HStack spacing={2}>
              <Badge colorScheme={ROLE_COLORS[user.role] || 'gray'} borderRadius="md">{user.role}</Badge>
              <Badge colorScheme={STATUS_COLORS[user.status] || 'gray'} borderRadius="md">{user.status}</Badge>
            </HStack>
          </Box>
        </HStack>

        <Divider />

        <Box>
          <Text fontSize="sm" fontWeight="semibold" mb={3}>Contact Information</Text>
          <SimpleGrid columns={2} spacing={4}>
            <InfoItem icon={FiMail} label="Email" value={user.email} />
          </SimpleGrid>
        </Box>

        <Divider />

        <Box>
          <Text fontSize="sm" fontWeight="semibold" mb={3}>Account Information</Text>
          <SimpleGrid columns={2} spacing={4}>
            <InfoItem icon={FiCalendar} label="Joined" value={user.joined} />
            <InfoItem icon={FiClock} label="Last Active" value={user.lastActive} />
          </SimpleGrid>
        </Box>

        {(user.bookings !== undefined || user.properties !== undefined) && (
          <>
            <Divider />
            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb={3}>Activity</Text>
              <SimpleGrid columns={2} spacing={4}>
                {user.bookings !== undefined && <InfoItem icon={FiShoppingBag} label="Total Bookings" value={user.bookings} />}
                {user.properties !== undefined && <InfoItem icon={FiHome} label="Total Properties" value={user.properties} />}
              </SimpleGrid>
            </Box>
          </>
        )}
      </VStack>
    </SidePanel>
  );
};

export default UserDetailsPanel;
