import { Box, VStack, Heading, Text, Flex, Avatar } from '@chakra-ui/react';
import {
  FiHome,
  FiGrid,
  FiCalendar,
  FiUsers,
  FiDollarSign,
  FiSettings,
} from 'react-icons/fi';
import { useAuth } from '../../app/providers/AuthProvider';
import SidebarNavItem from '../components/SidebarNavItem';

/**
 * Owner Sidebar Navigation
 * Scoped to what an owner actually needs: properties, bookings, tenants.
 */

const navItems = [
  { label: 'Dashboard', icon: FiHome, path: '/owner/dashboard' },
  { label: 'Properties', icon: FiGrid, path: '/owner/properties' },
  { label: 'Bookings', icon: FiCalendar, path: '/owner/bookings' },
  { label: 'Tenants', icon: FiUsers, path: '/owner/tenants' },
  { label: 'Payments', icon: FiDollarSign, path: '/owner/payments' },
  { label: 'Settings', icon: FiSettings, path: '/owner/settings' },
];

const OwnerSidebar = ({ onClose }) => {
  const { user } = useAuth();

  return (
    <Box h="100%" display="flex" flexDirection="column">
      {/* Logo/Brand */}
      <Box p={6} borderBottom="1px" borderColor="gray.200">
        <Heading size="lg" color="primary.600" fontWeight="bold">
          RentMe
        </Heading>
        <Text fontSize="sm" color="gray.600" mt={1}>
          Owner Portal
        </Text>
      </Box>

      {/* User Profile */}
      <Box p={6} borderBottom="1px" borderColor="gray.200">
        <Flex align="center" gap={3}>
          <Avatar size="md" name={user?.name} bg="primary.500" color="white" />
          <Box flex="1">
            <Text fontWeight="semibold" fontSize="sm" noOfLines={1}>
              {user?.name || 'Owner'}
            </Text>
            <Text fontSize="xs" color="gray.600" noOfLines={1}>
              {user?.email}
            </Text>
          </Box>
        </Flex>
      </Box>

      {/* Navigation Links */}
      <VStack spacing={1} align="stretch" p={4} flex="1">
        {navItems.map((item) => (
          <SidebarNavItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            path={item.path}
            onClick={onClose}
          />
        ))}
      </VStack>

      {/* Footer */}
      <Box p={4} borderTop="1px" borderColor="gray.200">
        <Text fontSize="xs" color="gray.500" textAlign="center">
          RentMe v3.0 © 2026
        </Text>
      </Box>
    </Box>
  );
};

export default OwnerSidebar;
