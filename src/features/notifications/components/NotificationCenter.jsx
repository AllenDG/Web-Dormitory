import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  IconButton,
  Badge,
  Button,
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
  FiCheck,
  FiCheckCircle,
  FiTrash2,
  FiSettings,
  FiMoreVertical,
} from 'react-icons/fi';
import { useState } from 'react';
import NotificationItem from './NotificationItem';

/**
 * Notification Center Component
 * Displays and manages user notifications
 * Week 15 - Notifications & Communication
 */

const NotificationCenter = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'booking',
      title: 'Booking Confirmed',
      message: 'Your booking for Modern Studio Room has been confirmed.',
      timestamp: '2026-06-03T10:30:00',
      read: false,
      actionUrl: '/bookings/1',
    },
    {
      id: 2,
      type: 'payment',
      title: 'Payment Successful',
      message: 'Your payment of ₱8,000 has been processed successfully.',
      timestamp: '2026-06-03T09:15:00',
      read: false,
      actionUrl: '/transactions/1',
    },
    {
      id: 3,
      type: 'message',
      title: 'New Message',
      message: 'Juan Dela Cruz sent you a message about the property.',
      timestamp: '2026-06-02T16:45:00',
      read: true,
      actionUrl: '/chat/1',
    },
    {
      id: 4,
      type: 'review',
      title: 'New Review',
      message: 'Maria Santos left a review for your property.',
      timestamp: '2026-06-02T14:20:00',
      read: true,
      actionUrl: '/reviews',
    },
    {
      id: 5,
      type: 'reminder',
      title: 'Visit Reminder',
      message: 'Your property visit is scheduled for tomorrow at 2:00 PM.',
      timestamp: '2026-06-01T10:00:00',
      read: true,
      actionUrl: '/visits/1',
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

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
