import { Box, VStack, Heading, Text, Icon, Flex, Avatar } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, 
  FiGrid, 
  FiCalendar, 
  FiUsers, 
  FiSettings,
  FiBarChart2,
  FiMessageSquare,
} from 'react-icons/fi';
import { useAuth } from '../../app/providers/AuthProvider';

/**
 * Owner Sidebar Navigation
 * Admin-style sidebar for property owners
 */

const navItems = [
  {
    label: 'Dashboard',
    icon: FiHome,
    path: '/owner/dashboard',
  },
  {
    label: 'Properties',
    icon: FiGrid,
    path: '/owner/properties',
  },
  {
    label: 'Bookings',
    icon: FiCalendar,
    path: '/owner/bookings',
  },
  {
    label: 'Tenants',
    icon: FiUsers,
    path: '/owner/tenants',
  },
  {
    label: 'Messages',
    icon: FiMessageSquare,
    path: '/owner/messages',
  },
  {
    label: 'Analytics',
    icon: FiBarChart2,
    path: '/owner/analytics',
  },
  {
    label: 'Settings',
    icon: FiSettings,
    path: '/owner/settings',
  },
];

const OwnerSidebar = ({ onClose }) => {
  const { user } = useAuth();

  return (
    <Box h="100%" display="flex" flexDirection="column">
      {/* Logo/Brand */}
      <Box p={6} borderBottom="1px" borderColor="gray.200">
        <Heading size="lg" color="primary.600" fontWeight="bold">
          Dormy
        </Heading>
        <Text fontSize="sm" color="gray.600" mt={1}>
          Owner Portal
        </Text>
      </Box>

      {/* User Profile */}
      <Box p={6} borderBottom="1px" borderColor="gray.200">
        <Flex align="center" gap={3}>
          <Avatar 
            size="md" 
            name={user?.name} 
            bg="primary.500"
            color="white"
          />
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
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            style={{ textDecoration: 'none' }}
          >
            {({ isActive }) => (
              <Flex
                align="center"
                gap={3}
                px={4}
                py={3}
                borderRadius="lg"
                bg={isActive ? 'primary.50' : 'transparent'}
                color={isActive ? 'primary.600' : 'gray.700'}
                fontWeight={isActive ? 'semibold' : 'medium'}
                cursor="pointer"
                transition="all 0.2s"
                _hover={{
                  bg: isActive ? 'primary.50' : 'gray.100',
                }}
              >
                <Icon as={item.icon} boxSize={5} />
                <Text fontSize="sm">{item.label}</Text>
              </Flex>
            )}
          </NavLink>
        ))}
      </VStack>

      {/* Footer */}
      <Box p={4} borderTop="1px" borderColor="gray.200">
        <Text fontSize="xs" color="gray.500" textAlign="center">
          Dormy v3.0 © 2026
        </Text>
      </Box>
    </Box>
  );
};

export default OwnerSidebar;
