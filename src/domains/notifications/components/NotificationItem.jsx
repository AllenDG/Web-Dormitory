import {
  Box,
  HStack,
  VStack,
  Text,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import {
  FiBell,
  FiShoppingBag,
  FiDollarSign,
  FiMessageSquare,
  FiStar,
  FiCalendar,
  FiAlertCircle,
  FiCheck,
  FiTrash2,
  FiMoreVertical,
} from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

/**
 * Notification Item Component
 * Individual notification card
 * Week 15 - Notifications & Communication
 */

const NotificationItem = ({ notification, onMarkAsRead, onDelete, onClose }) => {
  const navigate = useNavigate();

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking':
        return { icon: FiShoppingBag, color: 'primary.500' };
      case 'payment':
        return { icon: FiDollarSign, color: 'success.500' };
      case 'message':
        return { icon: FiMessageSquare, color: 'purple.500' };
      case 'review':
        return { icon: FiStar, color: 'warning.500' };
      case 'reminder':
        return { icon: FiCalendar, color: 'info.500' };
      case 'alert':
        return { icon: FiAlertCircle, color: 'error.500' };
      default:
        return { icon: FiBell, color: 'gray.500' };
    }
  };

  const iconConfig = getNotificationIcon(notification.type);

  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead();
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      onClose();
    }
  };

  return (
    <Box
      px={6}
      py={4}
      borderBottom="1px"
      borderColor="gray.100"
      bg={notification.read ? 'white' : 'blue.50'}
      cursor="pointer"
      onClick={handleClick}
      transition="all 0.2s"
      _hover={{ bg: notification.read ? 'gray.50' : 'blue.100' }}
    >
      <HStack align="start" spacing={3}>
        {/* Icon */}
        <Box
          bg={`${iconConfig.color.split('.')[0]}.50`}
          p={2}
          borderRadius="lg"
          flexShrink={0}
        >
          <Icon as={iconConfig.icon} boxSize={5} color={iconConfig.color} />
        </Box>

        {/* Content */}
        <VStack align="start" spacing={1} flex={1} minW={0}>
          <HStack justify="space-between" w="full">
            <Text
              fontWeight={notification.read ? 'medium' : 'semibold'}
              fontSize="sm"
              noOfLines={1}
            >
              {notification.title}
            </Text>
            {!notification.read && (
              <Box
                w="8px"
                h="8px"
                borderRadius="full"
                bg="primary.500"
                flexShrink={0}
              />
            )}
          </HStack>

          <Text
            fontSize="sm"
            color="gray.600"
            noOfLines={2}
          >
            {notification.message}
          </Text>

          <Text fontSize="xs" color="gray.500">
            {formatDistanceToNow(new Date(notification.timestamp), {
              addSuffix: true,
            })}
          </Text>
        </VStack>

        {/* Actions Menu */}
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<Icon as={FiMoreVertical} />}
            variant="ghost"
            size="sm"
            flexShrink={0}
            onClick={(e) => e.stopPropagation()}
          />
          <MenuList onClick={(e) => e.stopPropagation()}>
            {!notification.read && (
              <MenuItem
                icon={<Icon as={FiCheck} />}
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAsRead();
                }}
              >
                Mark as read
              </MenuItem>
            )}
            <MenuItem
              icon={<Icon as={FiTrash2} />}
              color="error.500"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              Delete
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Box>
  );
};

export default NotificationItem;
