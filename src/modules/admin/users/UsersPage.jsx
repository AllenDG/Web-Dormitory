import { useEffect, useMemo, useState } from 'react';
import { Box, SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiUsers, FiHome, FiShield } from 'react-icons/fi';
import PageBanner from '../../../shared/components/PageBanner';
import StatCard from '../../../shared/components/StatCard';
import useAdminStore from '../../../shared/stores/useAdminStore';
import UsersTable from './components/UsersTable';
import UserDetailsPanel from './components/UserDetailsPanel';
import UserFormPanel from './components/UserFormPanel';

const UsersPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState(null);
  const [formPanel, setFormPanel] = useState({ isOpen: false, mode: 'add', user: null });

  const users = useAdminStore((state) => state.users);
  const roleCounts = useMemo(
    () =>
      users.reduce(
        (acc, u) => {
          acc[u.role] = (acc[u.role] || 0) + 1;
          return acc;
        },
        { tenant: 0, owner: 0, admin: 0 }
      ),
    [users]
  );

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    onOpen();
  };

  const handleEditUser = (user) => {
    setFormPanel({ isOpen: true, mode: 'edit', user });
  };

  // Deep-linking: /admin/users/new auto-opens the Add User panel, then
  // normalizes the URL back to the role's base list once closed.
  useEffect(() => {
    if (location.pathname.endsWith('/new')) {
      setFormPanel({ isOpen: true, mode: 'add', user: null });
    }
  }, [location.pathname]);

  const closeFormPanel = () => {
    setFormPanel((prev) => ({ ...prev, isOpen: false }));
    if (location.pathname.endsWith('/new')) {
      navigate('/admin/users', { replace: true });
    }
  };

  return (
    <Box>
      <PageBanner
        title="User Management"
        subtitle="Manage every tenant, owner, and admin account on the platform"
      />

      <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={6} mb={8}>
        <StatCard label="Tenants" value={roleCounts.tenant} icon={FiUsers} color="primary" />
        <StatCard label="Owners" value={roleCounts.owner} icon={FiHome} color="success" />
        <StatCard label="Admins" value={roleCounts.admin} icon={FiShield} color="warning" />
      </SimpleGrid>

      <UsersTable
        onViewDetails={handleViewDetails}
        onEditUser={handleEditUser}
        addLabel="Add User"
        onAdd={() => setFormPanel({ isOpen: true, mode: 'add', user: null })}
      />
      <UserDetailsPanel isOpen={isOpen} onClose={onClose} user={selectedUser} />
      <UserFormPanel isOpen={formPanel.isOpen} mode={formPanel.mode} user={formPanel.user} onClose={closeFormPanel} />
    </Box>
  );
};

export default UsersPage;
