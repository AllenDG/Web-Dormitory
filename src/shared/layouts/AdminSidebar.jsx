import { Box, VStack, Heading, Text, Flex, Avatar } from '@chakra-ui/react';
import {
  FiHome,
  FiUsers,
  FiGrid,
  FiFlag,
  FiDollarSign,
  FiFileText,
  FiSettings,
  FiVolume2,
} from 'react-icons/fi';
import { useAuth } from '../../app/providers/AuthProvider';
import SidebarNavItem from '../components/SidebarNavItem';
import SidebarNavGroup from '../components/SidebarNavGroup';

const navItems = [
  { label: 'Dashboard', icon: FiHome, path: '/admin/dashboard' },
  {
    label: 'User Management',
    icon: FiUsers,
    path: '/admin/users',
    children: [
      { label: 'All Users', path: '/admin/users', end: true },
      { label: 'Tenants', path: '/admin/users/tenants' },
      { label: 'Owners', path: '/admin/users/owners' },
      { label: 'Admins', path: '/admin/users/admins' },
      { label: 'Add User', path: '/admin/users/new' },
    ],
  },
  {
    label: 'Property Management',
    icon: FiGrid,
    path: '/admin/properties',
    children: [
      { label: 'All Listings', path: '/admin/properties', end: true },
      { label: 'Pending', path: '/admin/properties/pending' },
      { label: 'Approved', path: '/admin/properties/approved' },
      { label: 'Rejected', path: '/admin/properties/rejected' },
      { label: 'Add Property', path: '/admin/properties/add' },
    ],
  },
  {
    label: 'Reported Issues',
    icon: FiFlag,
    path: '/admin/reports',
    children: [
      { label: 'All Reports', path: '/admin/reports', end: true },
      { label: 'Open', path: '/admin/reports/open' },
      { label: 'Investigating', path: '/admin/reports/investigating' },
      { label: 'Resolved', path: '/admin/reports/resolved' },
      { label: 'Property Reports', path: '/admin/reports/property-reports' },
      { label: 'User Reports', path: '/admin/reports/user-reports' },
      { label: 'Payment Reports', path: '/admin/reports/payment-reports' },
    ],
  },
  { label: 'Announcements', icon: FiVolume2, path: '/admin/notifications' },
  {
    label: 'Revenue',
    icon: FiDollarSign,
    path: '/admin/revenue',
    children: [
      { label: 'Overview', path: '/admin/revenue', end: true },
      { label: 'Transactions', path: '/admin/revenue/transactions' },
      { label: 'Refunds & Disputes', path: '/admin/revenue/refunds' },
    ],
  },
  {
    label: 'Audit Log',
    icon: FiFileText,
    path: '/admin/audit-log',
    children: [
      { label: 'All Activity', path: '/admin/audit-log', end: true },
      { label: 'User Actions', path: '/admin/audit-log/user-actions' },
      { label: 'Property Actions', path: '/admin/audit-log/property-actions' },
      { label: 'Report Actions', path: '/admin/audit-log/report-actions' },
      { label: 'Settings & Broadcasts', path: '/admin/audit-log/settings-actions' },
    ],
  },
  {
    label: 'Settings',
    icon: FiSettings,
    path: '/admin/settings',
    children: [
      { label: 'My Profile', path: '/admin/settings', end: true },
      { label: 'Business Profile', path: '/admin/settings/business' },
      { label: 'System Settings', path: '/admin/settings/system' },
      { label: 'Advanced Settings', path: '/admin/settings/advanced' },
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
