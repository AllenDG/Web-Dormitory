import { Box, VStack, Heading, Text, Flex, Avatar } from '@chakra-ui/react';
import {
  FiHome,
  FiUsers,
  FiGrid,
  FiFlag,
  FiDollarSign,
  FiFileText,
  FiSettings,
} from 'react-icons/fi';
import { useAuth } from '../../app/providers/AuthProvider';
import SidebarNavItem from '../components/SidebarNavItem';
import SidebarNavGroup from '../components/SidebarNavGroup';

const navItems = [
  { label: 'Dashboard', icon: FiHome, path: '/admin/dashboard' },
  {
    label: 'Users',
    icon: FiUsers,
    path: '/admin/users',
    children: [
      { label: 'All Users', path: '/admin/users', end: true },
      { label: 'Tenants', path: '/admin/users/tenants' },
      { label: 'Owners', path: '/admin/users/owners' },
      { label: 'Admins', path: '/admin/users/admins' },
    ],
  },
  {
    label: 'Properties',
    icon: FiGrid,
    path: '/admin/properties',
    children: [
      { label: 'All Listings', path: '/admin/properties', end: true },
      { label: 'Pending', path: '/admin/properties/pending' },
      { label: 'Approved', path: '/admin/properties/approved' },
      { label: 'Rejected', path: '/admin/properties/rejected' },
    ],
  },
  {
    label: 'Reports',
    icon: FiFlag,
    path: '/admin/reports',
    children: [
      { label: 'All Reports', path: '/admin/reports', end: true },
      { label: 'Open', path: '/admin/reports/open' },
      { label: 'Investigating', path: '/admin/reports/investigating' },
      { label: 'Resolved', path: '/admin/reports/resolved' },
    ],
  },
  { label: 'Revenue', icon: FiDollarSign, path: '/admin/revenue' },
  { label: 'Audit Log', icon: FiFileText, path: '/admin/audit-log' },
  {
    label: 'Settings',
    icon: FiSettings,
    path: '/admin/settings',
    children: [
      { label: 'My Profile', path: '/admin/settings', end: true },
      { label: 'Platform Settings', path: '/admin/settings/platform' },
    ],
  },
];

/** Admin Sidebar — same shell/active-state pattern as OwnerSidebar. */
const AdminSidebar = ({ onClose }) => {
  const { user } = useAuth();

  return (
    <Box h="100%" display="flex" flexDirection="column">
      <Box p={6} borderBottom="1px" borderColor="gray.200">
        <Heading size="lg" color="primary.600" fontWeight="bold">RentMe</Heading>
        <Text fontSize="sm" color="gray.600" mt={1}>Super Admin</Text>
      </Box>

      <Box p={6} borderBottom="1px" borderColor="gray.200">
        <Flex align="center" gap={3}>
          <Avatar size="md" name={user?.name} bg="primary.500" color="white" />
          <Box flex="1">
            <Text fontWeight="semibold" fontSize="sm" noOfLines={1}>{user?.name || 'Admin'}</Text>
            <Text fontSize="xs" color="gray.600" noOfLines={1}>{user?.email}</Text>
          </Box>
        </Flex>
      </Box>

      <VStack spacing={1} align="stretch" p={4} flex="1">
        {navItems.map((item) =>
          item.children ? (
            <SidebarNavGroup
              key={item.path}
              icon={item.icon}
              label={item.label}
              basePath={item.path}
              children={item.children}
            />
          ) : (
            <SidebarNavItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              onClick={onClose}
            />
          )
        )}
      </VStack>

      <Box p={4} borderTop="1px" borderColor="gray.200">
        <Text fontSize="xs" color="gray.600" textAlign="center">RentMe v3.0 © 2026</Text>
      </Box>
    </Box>
  );
};

export default AdminSidebar;
