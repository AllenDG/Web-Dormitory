import { Flex, HStack } from '@chakra-ui/react';
import NotificationCenter from '../../domains/notifications/components/NotificationCenter';
import ProfileMenu from '../components/ProfileMenu';

/** Admin Header — notifications + profile only, same pattern as OwnerHeader. */
const AdminHeader = () => {
  return (
    <Flex flex="1" justify="flex-end" align="center" gap={4}>
      <HStack spacing={2}>
        <NotificationCenter />
        <ProfileMenu settingsPath="/admin/settings" />
      </HStack>
    </Flex>
  );
};

export default AdminHeader;
