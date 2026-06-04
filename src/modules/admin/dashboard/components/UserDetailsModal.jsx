import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
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
import {
  FiMail,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiPhone,
  FiHome,
  FiShoppingBag,
} from 'react-icons/fi';

/**
 * UserDetailsModal Component
 * Display detailed information about a user
 */
export function UserDetailsModal({ isOpen, onClose, user }) {
  if (!user) return null;

  const InfoItem = ({ icon, label, value }) => (
    <HStack spacing={3} align="start">
      <Icon as={icon} boxSize={5} color="primary.500" mt={1} />
      <Box>
        <Text fontSize="xs" color="gray.500" mb={1}>
          {label}
        </Text>
        <Text fontSize="sm" fontWeight="medium">
          {value}
        </Text>
      </Box>
    </HStack>
  );

  const getRoleColor = (role) => {
    switch (role) {
      case 'owner':
        return 'purple';
      case 'tenant':
        return 'blue';
      case 'admin':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'suspended':
        return 'red';
      case 'inactive':
        return 'gray';
      default:
        return 'gray';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>User Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={6} align="stretch">
            {/* User Header */}
            <HStack spacing={4}>
              <Avatar size="xl" name={user.name} bg="primary.500" />
              <Box flex={1}>
                <Text fontSize="xl" fontWeight="bold" mb={1}>
                  {user.name}
                </Text>
                <Text fontSize="sm" color="gray.600" mb={2}>
                  {user.email}
                </Text>
                <HStack spacing={2}>
                  <Badge
                    colorScheme={getRoleColor(user.role)}
                    borderRadius="8px"
                  >
                    {user.role}
                  </Badge>
                  <Badge
                    colorScheme={getStatusColor(user.status)}
                    borderRadius="8px"
                  >
                    {user.status}
                  </Badge>
                </HStack>
              </Box>
            </HStack>

            <Divider />

            {/* Contact Information */}
            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb={3}>
                Contact Information
              </Text>
              <SimpleGrid columns={2} spacing={4}>
                <InfoItem icon={FiMail} label="Email" value={user.email} />
                <InfoItem
                  icon={FiPhone}
                  label="Phone"
                  value="+63 912 345 6789"
                />
                <InfoItem
                  icon={FiMapPin}
                  label="Location"
                  value="Dagupan City, Pangasinan"
                />
              </SimpleGrid>
            </Box>

            <Divider />

            {/* Account Information */}
            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb={3}>
                Account Information
              </Text>
              <SimpleGrid columns={2} spacing={4}>
                <InfoItem icon={FiCalendar} label="Joined" value={user.joined} />
                <InfoItem
                  icon={FiClock}
                  label="Last Active"
                  value={user.lastActive}
                />
              </SimpleGrid>
            </Box>

            <Divider />

            {/* Activity */}
            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb={3}>
                Activity
              </Text>
              <SimpleGrid columns={2} spacing={4}>
                {user.bookings !== undefined && (
                  <InfoItem
                    icon={FiShoppingBag}
                    label="Total Bookings"
                    value={user.bookings}
                  />
                )}
                {user.properties !== undefined && (
                  <InfoItem
                    icon={FiHome}
                    label="Total Properties"
                    value={user.properties}
                  />
                )}
              </SimpleGrid>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
