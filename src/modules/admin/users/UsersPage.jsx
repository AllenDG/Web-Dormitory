import { useState } from 'react';
import { Box, useDisclosure } from '@chakra-ui/react';
import PageBanner from '../../../shared/components/PageBanner';
import UsersTable from './components/UsersTable';
import UserDetailsPanel from './components/UserDetailsPanel';

const ROLE_TITLES = { all: 'Users', tenant: 'Tenants', owner: 'Owners', admin: 'Admins' };

const UsersPage = ({ role = 'all' }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState(null);

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    onOpen();
  };

  return (
    <Box>
      <PageBanner title={ROLE_TITLES[role]} subtitle="Manage platform users" />
      <UsersTable role={role} onViewDetails={handleViewDetails} />
      <UserDetailsPanel isOpen={isOpen} onClose={onClose} user={selectedUser} />
    </Box>
  );
};

export default UsersPage;
