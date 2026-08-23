import { Box, VStack, Heading, Text } from '@chakra-ui/react';
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
import SidebarNavItem from '../components/SidebarNavItem';
import SidebarNavGroup from '../components/SidebarNavGroup';

const navItems = [
  { label: 'Dashboard', icon: FiHome, path: '/admin/dashboard' },
  { label: 'User Management', icon: FiUsers, path: '/admin/users' },
  { label: 'Property Management', icon: FiGrid, path: '/admin/properties' },
  { label: 'Reported Issues', icon: FiFlag, path: '/admin/reports' },
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
  return (
    <Box h="100%" display="flex" flexDirection="column">
      <Box px={6} py={4} borderBottom="1px" borderColor="gray.200">
        <Heading size="md" color="primary.600" fontWeight="bold">RentMe</Heading>
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
