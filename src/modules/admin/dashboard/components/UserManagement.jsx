import { useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import {
  FiSearch,
  FiMoreVertical,
  FiEye,
  FiEdit,
  FiUserX,
  FiUserCheck,
  FiMail,
} from 'react-icons/fi';
import useAdminStore from '../../../../shared/stores/useAdminStore';

/**
 * UserManagement Component
 * Manage platform users with search, filter, and actions
 */
export function UserManagement({ onViewDetails }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const allUsers = useAdminStore((state) => state.users);
  const updateUserStatus = useAdminStore((state) => state.updateUserStatus);

  const users = allUsers.filter((user) => {
    const matchesSearch =
      !searchQuery ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAction = (action, user) => {
    if (action === 'Suspend') {
      updateUserStatus(user.id, 'suspended');
    } else if (action === 'Activate') {
      updateUserStatus(user.id, 'active');
    }

    toast({
      title: `${action} ${user.name}`,
      description: 'Action performed successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

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
    <Box
      bg={bgColor}
      p={6}
      borderRadius="8px"
      border="1px"
      borderColor={borderColor}
    >
      {/* Filters */}
      <HStack spacing={4} mb={6}>
        <InputGroup maxW="300px">
          <InputLeftElement pointerEvents="none">
            <FiSearch color="gray" />
          </InputLeftElement>
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>

        <Select
          maxW="150px"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="tenant">Tenants</option>
          <option value="owner">Owners</option>
          <option value="admin">Admins</option>
        </Select>

        <Select
          maxW="150px"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="inactive">Inactive</option>
        </Select>
      </HStack>

      {/* Table */}
      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>User</Th>
              <Th>Role</Th>
              <Th>Status</Th>
              <Th>Joined</Th>
              <Th>Last Active</Th>
              <Th>Activity</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.length === 0 && (
              <Tr>
                <Td colSpan={7}>
                  <Text textAlign="center" color="gray.500" py={6}>
                    No users match your search or filters.
                  </Text>
                </Td>
              </Tr>
            )}
            {users.map((user) => (
              <Tr key={user.id}>
                <Td>
                  <HStack>
                    <Avatar
                      size="sm"
                      name={user.name}
                      bg="primary.500"
                    />
                    <Box>
                      <Text fontWeight="semibold" fontSize="sm">
                        {user.name}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {user.email}
                      </Text>
                    </Box>
                  </HStack>
                </Td>
                <Td>
                  <Badge
                    colorScheme={getRoleColor(user.role)}
                    borderRadius="8px"
                  >
                    {user.role}
                  </Badge>
                </Td>
                <Td>
                  <Badge
                    colorScheme={getStatusColor(user.status)}
                    borderRadius="8px"
                  >
                    {user.status}
                  </Badge>
                </Td>
                <Td fontSize="sm">{user.joined}</Td>
                <Td fontSize="sm" color="gray.600">
                  {user.lastActive}
                </Td>
                <Td fontSize="sm">
                  {user.bookings !== undefined && `${user.bookings} bookings`}
                  {user.properties !== undefined &&
                    `${user.properties} properties`}
                </Td>
                <Td>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<FiMoreVertical />}
                      variant="ghost"
                      size="sm"
                      aria-label={`More actions for ${user.name}`}
                    />
                    <MenuList>
                      <MenuItem
                        icon={<FiEye />}
                        onClick={() => onViewDetails && onViewDetails(user)}
                      >
                        View Details
                      </MenuItem>
                      <MenuItem
                        icon={<FiEdit />}
                        onClick={() => handleAction('Edit', user)}
                      >
                        Edit User
                      </MenuItem>
                      <MenuItem
                        icon={<FiMail />}
                        onClick={() => handleAction('Email', user)}
                      >
                        Send Email
                      </MenuItem>
                      {user.status === 'active' ? (
                        <MenuItem
                          icon={<FiUserX />}
                          onClick={() => handleAction('Suspend', user)}
                          color="red.500"
                        >
                          Suspend User
                        </MenuItem>
                      ) : (
                        <MenuItem
                          icon={<FiUserCheck />}
                          onClick={() => handleAction('Activate', user)}
                          color="green.500"
                        >
                          Activate User
                        </MenuItem>
                      )}
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
