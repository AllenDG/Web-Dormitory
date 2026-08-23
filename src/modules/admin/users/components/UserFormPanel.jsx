import {
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import SidePanel from '../../../../shared/components/SidePanel';
import useAdminStore from '../../../../shared/stores/useAdminStore';
import useAuditLogStore from '../../../../shared/stores/useAuditLogStore';
import { useAuth } from '../../../../app/providers/AuthProvider';
import { useAppToast } from '../../../../shared/hooks/useAppToast';
import { FiUserPlus } from 'react-icons/fi';

const EMPTY_FORM = { name: '', email: '', role: 'tenant', status: 'active', phone: '' };

/**
 * Add/Edit User side panel — the bypass tier for User Management. Role is
 * editable here (an admin can promote/demote), unlike everywhere else in
 * the app where role is fixed at signup.
 *
 * Props: { mode: 'add' | 'edit', user?, isOpen, onClose }
 */
const UserFormPanel = ({ mode, user, isOpen, onClose }) => {
  const isEdit = mode === 'edit';
  const toast = useAppToast();
  const { user: actor } = useAuth();
  const createUser = useAdminStore((state) => state.createUser);
  const updateUser = useAdminStore((state) => state.updateUser);
  const logAction = useAuditLogStore((state) => state.logAction);

  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (isOpen) {
      setForm(
        isEdit && user
          ? { name: user.name, email: user.email, role: user.role, status: user.status, phone: user.phone || '' }
          : EMPTY_FORM
      );
    }
  }, [isOpen, isEdit, user]);

  const setField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    if (!form.name || !form.email) {
      toast({ title: 'Name and email are required', status: 'warning' });
      return;
    }

    if (isEdit) {
      updateUser(user.id, form);
      logAction({ actorEmail: actor?.email, actorName: actor?.name, action: 'user.updated', target: form.name });
      toast({ title: 'User Updated', description: `${form.name}'s details have been saved.`, status: 'success' });
    } else {
      createUser(form);
      logAction({ actorEmail: actor?.email, actorName: actor?.name, action: 'user.created', target: form.name });
      toast({ title: 'User Added', description: `${form.name} has been added to the platform.`, status: 'success' });
    }
    onClose();
  };

  return (
    <SidePanel
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit User' : 'Add User'}
      icon={FiUserPlus}
      footer={
        <HStack spacing={3} w="full">
          <Button variant="outline" onClick={onClose} flex={1}>Cancel</Button>
          <Button colorScheme="primary" onClick={handleSubmit} flex={1}>
            {isEdit ? 'Save Changes' : 'Add User'}
          </Button>
        </HStack>
      }
    >
      <VStack spacing={5} align="stretch">
        <FormControl isRequired>
          <FormLabel>Full Name</FormLabel>
          <Input value={form.name} onChange={(e) => setField('name', e.target.value)} placeholder="Juan Dela Cruz" />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Email Address</FormLabel>
          <Input type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} placeholder="juan@email.com" />
        </FormControl>

        <HStack spacing={4} align="start">
          <FormControl isRequired>
            <FormLabel>Role</FormLabel>
            <Select value={form.role} onChange={(e) => setField('role', e.target.value)}>
              <option value="tenant">Tenant</option>
              <option value="owner">Owner</option>
              <option value="admin">Admin</option>
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Status</FormLabel>
            <Select value={form.status} onChange={(e) => setField('status', e.target.value)}>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="inactive">Inactive</option>
            </Select>
          </FormControl>
        </HStack>

        <FormControl>
          <FormLabel>Phone Number</FormLabel>
          <Input value={form.phone} onChange={(e) => setField('phone', e.target.value)} placeholder="+63 912 345 6789" />
        </FormControl>
      </VStack>
    </SidePanel>
  );
};

export default UserFormPanel;
