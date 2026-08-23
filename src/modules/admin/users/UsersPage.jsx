import { useEffect, useState } from 'react';
import { Box, Icon, useDisclosure } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import PageBanner from '../../../shared/components/PageBanner';
import Button from '../../../shared/components/Button';
import UsersTable from './components/UsersTable';
import UserDetailsPanel from './components/UserDetailsPanel';
import UserFormPanel from './components/UserFormPanel';

const ROLE_TITLES = { all: 'All Users', tenant: 'Tenants', owner: 'Owners', admin: 'Admins' };
const ROLE_BASE_PATHS = { all: '/admin/users', tenant: '/admin/users/tenants', owner: '/admin/users/owners', admin: '/admin/users/admins' };

const UsersPage = ({ role = 'all' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState(null);
  const [formPanel, setFormPanel] = useState({ isOpen: false, mode: 'add', user: null });

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
      navigate(ROLE_BASE_PATHS[role], { replace: true });
    }
  };

  return (
    <Box>
      <PageBanner
        title={ROLE_TITLES[role]}
        subtitle="Manage platform users"
        actions={
          <Button leftIcon={<Icon as={FiPlus} />} onClick={() => setFormPanel({ isOpen: true, mode: 'add', user: null })}>
            Add User
          </Button>
        }
      />
      <UsersTable role={role} onViewDetails={handleViewDetails} onEditUser={handleEditUser} />
      <UserDetailsPanel isOpen={isOpen} onClose={onClose} user={selectedUser} />
      <UserFormPanel isOpen={formPanel.isOpen} mode={formPanel.mode} user={formPanel.user} onClose={closeFormPanel} />
    </Box>
  );
};

export default UsersPage;
