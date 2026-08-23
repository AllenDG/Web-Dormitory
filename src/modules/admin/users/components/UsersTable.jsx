import { useState, useMemo } from 'react';
import { Box, Avatar, Badge, HStack, Flex, Text, Input, Select } from '@chakra-ui/react';
import { FiEye, FiEdit, FiUserX, FiUserCheck, FiMail, FiTrash2 } from 'react-icons/fi';
import useAdminStore from '../../../../shared/stores/useAdminStore';
import useAuditLogStore from '../../../../shared/stores/useAuditLogStore';
import { useAuth } from '../../../../app/providers/AuthProvider';
import DataTable from '../../../../shared/components/DataTable';
import TableToolbar from '../../../../shared/components/TableToolbar';
import { TableSkeleton } from '../../../../shared/components/LoadingState';
import { useMinDisplayTime } from '../../../../shared/hooks/useMinDisplayTime';
import { useAppToast } from '../../../../shared/hooks/useAppToast';
import { confirmAction } from '../../../../shared/utils/confirm';

const ROLE_COLORS = { owner: 'purple', tenant: 'blue', admin: 'red' };
const STATUS_COLORS = { active: 'green', suspended: 'red', inactive: 'gray' };

const parseJoinedDate = (joinedStr) => {
  try {
    return new Date(joinedStr).getTime();
  } catch {
    return 0;
  }
};

const parseLastActiveBucket = (lastActiveStr) => {
  const match = lastActiveStr.match(/(\d+)\s+(\w+)\s+ago/i);
  if (!match) return 'today';
  const [, num, unit] = match;
  const value = parseInt(num, 10);
  const normalizedUnit = unit.toLowerCase().slice(0, 1);
  if (normalizedUnit === 'h') return value <= 24 ? 'today' : 'today';
  if (normalizedUnit === 'd') return value <= 6 ? 'week' : value <= 30 ? 'month' : 'inactive';
  if (normalizedUnit === 'w') return value <= 4 ? 'month' : 'inactive';
  if (normalizedUnit === 'm') return 'inactive';
  return 'today';
};

const enrichUsers = (users) =>
  users.map((user) => ({
    ...user,
    joinedAt: parseJoinedDate(user.joined),
    lastActiveBucket: parseLastActiveBucket(user.lastActive),
  }));

export function UsersTable({ onViewDetails, onEditUser, addLabel, onAdd }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [joinedFrom, setJoinedFrom] = useState('');
  const [joinedTo, setJoinedTo] = useState('');
  const [lastActiveBucket, setLastActiveBucket] = useState('all');
  const toast = useAppToast();
  const { user: actor } = useAuth();
  const isLoading = useMinDisplayTime();

  const allUsers = useAdminStore((state) => state.users);
  const updateUserStatus = useAdminStore((state) => state.updateUserStatus);
  const deleteUser = useAdminStore((state) => state.deleteUser);
  const logAction = useAuditLogStore((state) => state.logAction);

  const enrichedUsers = useMemo(() => enrichUsers(allUsers), [allUsers]);

  const users = enrichedUsers.filter((user) => {
    const matchesSearch =
      !searchQuery ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const fromTime = joinedFrom ? new Date(joinedFrom).getTime() : 0;
    const toTime = joinedTo ? new Date(joinedTo).getTime() : Infinity;
    const matchesDateRange = user.joinedAt >= fromTime && user.joinedAt <= toTime;
    const matchesLastActive = lastActiveBucket === 'all' || user.lastActiveBucket === lastActiveBucket;
    return matchesSearch && matchesRole && matchesStatus && matchesDateRange && matchesLastActive;
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

  const handleDeleteUser = async (user) => {
    const confirmed = await confirmAction({
      title: 'Delete User',
      text: `Permanently delete ${user.name}? This cannot be undone.`,
      isDestructive: true,
      confirmButtonText: 'Delete',
    });
    if (!confirmed) return;

    deleteUser(user.id);
    logAction({ actorEmail: actor?.email, actorName: actor?.name, action: 'user.deleted', target: user.name });
    toast({ title: `${user.name} deleted`, status: 'info' });
  };

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
            <Text fontSize="xs" color="gray.600">{u.email}</Text>
          </Box>
        </HStack>
      ),
    },
    { key: 'role', label: 'Role', sortable: true, render: (u) => <Badge colorScheme={ROLE_COLORS[u.role] || 'gray'} borderRadius="md">{u.role}</Badge> },
    { key: 'status', label: 'Status', sortable: true, render: (u) => <Badge colorScheme={STATUS_COLORS[u.status] || 'gray'} borderRadius="md">{u.status}</Badge> },
    { key: 'joinedAt', label: 'Joined', sortable: true, render: (u) => u.joined },
    { key: 'lastActiveBucket', label: 'Last Active', sortable: true, render: (u) => u.lastActive },
    {
      key: 'activity',
      label: 'Activity',
      render: (u) => (u.bookings !== undefined ? `${u.bookings} bookings` : u.properties !== undefined ? `${u.properties} properties` : '—'),
    },
  ];

  const getRowActions = (user) => [
    { label: 'View Details', icon: FiEye, onClick: () => onViewDetails?.(user) },
    { label: 'Edit User', icon: FiEdit, onClick: () => onEditUser?.(user) },
    { label: 'Send Email', icon: FiMail, onClick: () => notAvailable('Sending email') },
    {
      label: user.status === 'active' ? 'Suspend User' : 'Activate User',
      icon: user.status === 'active' ? FiUserX : FiUserCheck,
      isDestructive: user.status === 'active',
      onClick: () => handleToggleStatus(user),
    },
    { label: 'Delete User', icon: FiTrash2, isDestructive: true, onClick: () => handleDeleteUser(user) },
  ];

  return (
    <Box>
      <TableToolbar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search users..."
        filtersOpen={filtersOpen}
        onToggleFilters={() => setFiltersOpen((prev) => !prev)}
        addLabel={addLabel}
        onAdd={onAdd}
      >
        <Flex wrap="wrap" gap={4}>
          <Select flex="1" minW={{ base: '100%', sm: '160px' }} value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="all">All Roles</option>
            <option value="tenant">Tenants</option>
            <option value="owner">Owners</option>
            <option value="admin">Admins</option>
          </Select>
          <Select flex="1" minW={{ base: '100%', sm: '160px' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="inactive">Inactive</option>
          </Select>
          <Select flex="1" minW={{ base: '100%', sm: '160px' }} value={lastActiveBucket} onChange={(e) => setLastActiveBucket(e.target.value)}>
            <option value="all">All Activity</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="inactive">Inactive 1mo+</option>
          </Select>
          <Input
            type="date"
            aria-label="Joined from"
            flex="1"
            minW={{ base: '100%', sm: '150px' }}
            value={joinedFrom}
            onChange={(e) => setJoinedFrom(e.target.value)}
          />
          <Input
            type="date"
            aria-label="Joined to"
            flex="1"
            minW={{ base: '100%', sm: '150px' }}
            value={joinedTo}
            onChange={(e) => setJoinedTo(e.target.value)}
          />
        </Flex>
      </TableToolbar>

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
