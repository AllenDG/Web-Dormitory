import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  IconButton,
  Badge,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import {
  FiBell,
  FiCheckCircle,
  FiTrash2,
  FiSettings,
  FiMoreVertical,
} from 'react-icons/fi';
import NotificationItem from './NotificationItem';
import useNotificationStore from '../../../shared/stores/useNotificationStore';
import { useAuth } from '../../../app/providers/AuthProvider';

/**
 * Notification Center Component
 * Displays and manages user notifications
 * Week 15 - Notifications & Communication
 */

const NotificationCenter = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuth();
  const allStoreNotifications = useNotificationStore((state) => state.notifications);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);
  const deleteNotification = useNotificationStore((state) => state.deleteNotification);
  const clearAll = useNotificationStore((state) => state.clearAll);

  const notifications = allStoreNotifications.filter(
    (n) => n.recipientEmail === user?.email
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id) => markAsRead(id);
  const handleMarkAllAsRead = () => markAllAsRead(user?.email);
  const handleDelete = (id) => deleteNotification(id);
  const handleClearAll = () => clearAll(user?.email);

  const allNotifications = notifications;
  const unreadNotifications = notifications.filter((n) => !n.read);

  return (
    <>
      {/* Bell Icon Button */}
      <Box position="relative">
        <IconButton
          icon={<Icon as={FiBell} />}
          variant="ghost"
          onClick={onOpen}
          aria-label="Notifications"
        />
        {unreadCount > 0 && (
          <Badge
            position="absolute"
            top="-1"
            right="-1"
            colorScheme="red"
            borderRadius="full"
            fontSize="xs"
            minW="20px"
            h="20px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Box>

      {/* Notification Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            <HStack justify="space-between">
              <HStack spacing={2}>
                <Icon as={FiBell} boxSize={5} />
                <Text>Notifications</Text>
                {unreadCount > 0 && (
                  <Badge colorScheme="primary" borderRadius="full">
                    {unreadCount}
                  </Badge>
                )}
              </HStack>
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<Icon as={FiMoreVertical} />}
                  variant="ghost"
                  size="sm"
                />
                <MenuList>
                  <MenuItem
                    icon={<Icon as={FiCheckCircle} />}
                    onClick={handleMarkAllAsRead}
                    isDisabled={unreadCount === 0}
                  >
                    Mark all as read
                  </MenuItem>
                  <MenuItem
                    icon={<Icon as={FiTrash2} />}
                    onClick={handleClearAll}
                    color="error.500"
                    isDisabled={notifications.length === 0}
                  >
                    Clear all
                  </MenuItem>
                  <MenuItem icon={<Icon as={FiSettings} />}>
                    Notification settings
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </DrawerHeader>

          <DrawerBody px={0}>
            <Tabs colorScheme="primary">
              <TabList px={6}>
                <Tab>
                  All ({allNotifications.length})
                </Tab>
                <Tab>
                  Unread ({unreadNotifications.length})
                </Tab>
              </TabList>

              <TabPanels>
                {/* All Notifications Tab */}
                <TabPanel px={0} py={0}>
                  {allNotifications.length > 0 ? (
                    <VStack align="stretch" spacing={0}>
                      {allNotifications.map((notification) => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                          onMarkAsRead={() => handleMarkAsRead(notification.id)}
                          onDelete={() => handleDelete(notification.id)}
                          onClose={onClose}
                        />
                      ))}
                    </VStack>
                  ) : (
                    <Box
                      py={12}
                      px={6}
                      textAlign="center"
                    >
                      <VStack spacing={3}>
                        <Text fontSize="4xl">🔔</Text>
                        <Text fontWeight="semibold">No Notifications</Text>
                        <Text fontSize="sm" color="gray.600">
                          You're all caught up!
                        </Text>
                      </VStack>
                    </Box>
                  )}
                </TabPanel>

                {/* Unread Notifications Tab */}
                <TabPanel px={0} py={0}>
                  {unreadNotifications.length > 0 ? (
                    <VStack align="stretch" spacing={0}>
                      {unreadNotifications.map((notification) => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                          onMarkAsRead={() => handleMarkAsRead(notification.id)}
                          onDelete={() => handleDelete(notification.id)}
                          onClose={onClose}
                        />
                      ))}
                    </VStack>
                  ) : (
                    <Box
                      py={12}
                      px={6}
                      textAlign="center"
                    >
                      <VStack spacing={3}>
                        <Text fontSize="4xl">✅</Text>
                        <Text fontWeight="semibold">All Caught Up!</Text>
                        <Text fontSize="sm" color="gray.600">
                          No unread notifications
                        </Text>
                      </VStack>
                    </Box>
                  )}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default NotificationCenter;
