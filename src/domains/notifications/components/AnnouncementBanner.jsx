import {
  Box,
  HStack,
  Text,
  Icon,
  IconButton,
  Link,
  CloseButton,
} from '@chakra-ui/react';
import {
  FiInfo,
  FiAlertCircle,
  FiCheckCircle,
  FiAlertTriangle,
} from 'react-icons/fi';
import { useState } from 'react';

/**
 * Announcement Banner Component
 * Display important announcements and alerts
 * Week 15 - Notifications & Communication
 */

const AnnouncementBanner = ({
  type = 'info',
  message,
  actionText,
  actionUrl,
  onClose,
  closable = true,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'success.50',
          borderColor: 'success.500',
          textColor: 'success.800',
          icon: FiCheckCircle,
          iconColor: 'success.500',
        };
      case 'warning':
        return {
          bg: 'warning.50',
          borderColor: 'warning.500',
          textColor: 'warning.800',
          icon: FiAlertTriangle,
          iconColor: 'warning.500',
        };
      case 'error':
        return {
          bg: 'error.50',
          borderColor: 'error.500',
          textColor: 'error.800',
          icon: FiAlertCircle,
          iconColor: 'error.500',
        };
      default:
        return {
          bg: 'blue.50',
          borderColor: 'blue.500',
          textColor: 'blue.800',
          icon: FiInfo,
          iconColor: 'blue.500',
        };
    }
  };

  const config = getTypeConfig();

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  return (
    <Box
      bg={config.bg}
      borderLeft="4px"
      borderColor={config.borderColor}
      py={3}
      px={4}
    >
      <HStack spacing={3} justify="space-between">
        <HStack spacing={3} flex={1}>
          <Icon as={config.icon} boxSize={5} color={config.iconColor} />
          <Text fontSize="sm" color={config.textColor} flex={1}>
            {message}
          </Text>
        </HStack>

        <HStack spacing={2}>
          {actionText && actionUrl && (
            <Link
              href={actionUrl}
              fontSize="sm"
              fontWeight="semibold"
              color={config.iconColor}
              _hover={{ textDecoration: 'underline' }}
            >
              {actionText}
            </Link>
          )}
          {closable && (
            <CloseButton
              size="sm"
              onClick={handleClose}
              color={config.textColor}
            />
          )}
        </HStack>
      </HStack>
    </Box>
  );
};

export default AnnouncementBanner;
