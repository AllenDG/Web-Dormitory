import { useState } from 'react';
import { Box, Avatar, Badge, HStack, Text, Input, InputGroup, InputLeftElement, Select, Icon } from '@chakra-ui/react';
import { FiSearch, FiEye, FiEdit, FiUserX, FiUserCheck, FiMail } from 'react-icons/fi';
import useAdminStore from '../../../../shared/stores/useAdminStore';
import useAuditLogStore from '../../../../shared/stores/useAuditLogStore';
import { useAuth } from '../../../../app/providers/AuthProvider';
import DataTable from '../../../../shared/components/DataTable';
import { TableSkeleton } from '../../../../shared/components/LoadingState';
import { useMinDisplayTime } from '../../../../shared/hooks/useMinDisplayTime';
import { useAppToast } from '../../../../shared/hooks/useAppToast';
import { confirmAction } from '../../../../shared/utils/confirm';

const ROLE_COLORS = { owner: 'purple', tenant: 'blue', admin: 'red' };
const STATUS_COLORS = { active: 'green', suspended: 'red', inactive: 'gray' };

export function UsersTable({ role = 'all', onViewDetails }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const toast = useAppToast();
  const { user: actor } = useAuth();
  const isLoading = useMinDisplayTime();

  const allUsers = useAdminStore((state) => state.users);
  const updateUserStatus = useAdminStore((state) => state.updateUserStatus);
  const logAction = useAuditLogStore((state) => state.logAction);

  const users = allUsers.filter((user) => {
    const matchesSearch =
      !searchQuery ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = role === 'all' || user.role === role;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleToggleStatus = async (user) => {
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';
    const confirmed = await confirmAction({
      title: nextStatus === 'suspended' ? 'Suspend User' : 'Activate User',
      text: `${nextStatus === 'suspended' ? 'Suspend' : 'Activate'} ${user.name}'s account?`,
      isDestructive: nextStatus === 'suspended',
      confirmButtonText: nextStatus === 'suspended' ? 'Suspend' : 'Activate',
    });
    if (!confirmed) return;

    updateUserStatus(user.id, nextStatus);
    logAction({
      actorEmail: actor?.email,
      actorName: actor?.name,
      action: 'user.status_changed',
      target: user.name,
      details: `Status changed to ${nextStatus}`,
    });
    toast({ title: `${user.name} ${nextStatus}`, status: 'success' });
  };

  const notAvailable = (feature) =>
    toast({ title: 'Not available yet', description: `${feature} isn't supported in this preview.`, status: 'info' });

  const columns = [
    {
      key: 'name',
      label: 'User',
      sortable: true,
      render: (u) => (
        <HStack>
          <Avatar size="sm" name={u.name} bg="primary.500" />
          <Box>
            <Text fontWeight="semibold" fontSize="sm">{u.name}</Text>
            <Text fontSize="xs" color="gray.500">{u.email}</Text>
          </Box>
        </HStack>
      ),
    },
    { key: 'role', label: 'Role', sortable: true, render: (u) => <Badge colorScheme={ROLE_COLORS[u.role] || 'gray'} borderRadius="md">{u.role}</Badge> },
    { key: 'status', label: 'Status', sortable: true, render: (u) => <Badge colorScheme={STATUS_COLORS[u.status] || 'gray'} borderRadius="md">{u.status}</Badge> },
    { key: 'joined', label: 'Joined', sortable: true },
    { key: 'lastActive', label: 'Last Active', sortable: true },
    {
      key: 'activity',
      label: 'Activity',
      render: (u) => (u.bookings !== undefined ? `${u.bookings} bookings` : u.properties !== undefined ? `${u.properties} properties` : '—'),
    },
  ];

  const getRowActions = (user) => [
    { label: 'View Details', icon: FiEye, onClick: () => onViewDetails?.(user) },
    { label: 'Edit User', icon: FiEdit, onClick: () => notAvailable('Editing users') },
    { label: 'Send Email', icon: FiMail, onClick: () => notAvailable('Sending email') },
    {
      label: user.status === 'active' ? 'Suspend User' : 'Activate User',
      icon: user.status === 'active' ? FiUserX : FiUserCheck,
      isDestructive: user.status === 'active',
      onClick: () => handleToggleStatus(user),
    },
  ];

  return (
    <Box>
      <InputGroup mb={6} w="full">
        <InputLeftElement pointerEvents="none"><Icon as={FiSearch} color="gray.400" /></InputLeftElement>
        <Input placeholder="Search users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </InputGroup>
      <HStack spacing={4} mb={6}>
        <Select maxW="150px" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="inactive">Inactive</option>
        </Select>
      </HStack>

      {isLoading ? (
        <TableSkeleton rows={5} columns={6} />
      ) : (
        <DataTable
          columns={columns}
          data={users}
          getRowKey={(u) => u.id}
          getRowActions={getRowActions}
          emptyState="No users match your search or filters."
        />
      )}
    </Box>
  );
}

export default UsersTable;
