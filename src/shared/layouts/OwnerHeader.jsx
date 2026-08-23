import { Flex, HStack } from '@chakra-ui/react';
import NotificationCenter from '../../domains/notifications/components/NotificationCenter';
import ProfileMenu from '../components/ProfileMenu';

/**
 * Owner Header
 * Top header bar for owner portal — notifications + profile only.
 * Welcome message moved to the Dashboard's PageBanner; search moved next
 * to Quick Actions.
 */
const OwnerHeader = () => {
  return (
    <Flex flex="1" justify="flex-end" align="center" gap={4}>
      <HStack spacing={2}>
        <NotificationCenter />
        <ProfileMenu settingsPath="/owner/settings" />
      </HStack>
    </Flex>
  );
};

export default OwnerHeader;
