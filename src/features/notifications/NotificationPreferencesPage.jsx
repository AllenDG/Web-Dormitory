import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Switch,
  Divider,
  Button,
  Icon,
  SimpleGrid,
  useToast,
} from '@chakra-ui/react';
import {
  FiBell,
  FiMail,
  FiSmartphone,
  FiSave,
} from 'react-icons/fi';
import { useState } from 'react';

/**
 * Notification Preferences Page
 * Manage notification settings
 * Week 15 - Notifications & Communication
 */

const PreferenceSection = ({ title, description, children }) => {
  return (
    <Box>
      <VStack align="start" spacing={1} mb={4}>
        <Text fontWeight="semibold">{title}</Text>
        <Text fontSize="sm" color="gray.600">
          {description}
        </Text>
      </VStack>
      <VStack align="stretch" spacing={3}>
        {children}
      </VStack>
    </Box>
  );
};

const PreferenceItem = ({ label, description, checked, onChange }) => {
  return (
    <HStack justify="space-between" py={2}>
      <VStack align="start" spacing={0} flex={1}>
        <Text fontSize="sm" fontWeight="medium">
          {label}
        </Text>
        {description && (
          <Text fontSize="xs" color="gray.600">
            {description}
          </Text>
        )}
      </VStack>
      <Switch
        colorScheme="primary"
        isChecked={checked}
        onChange={onChange}
      />
    </HStack>
  );
};

const NotificationPreferencesPage = () => {
  const toast = useToast();

  // Email Notifications
  const [emailPrefs, setEmailPrefs] = useState({
    bookings: true,
    payments: true,
    messages: true,
    reviews: false,
    reminders: true,
    marketing: false,
  });

  // Push Notifications
  const [pushPrefs, setPushPrefs] = useState({
    bookings: true,
    payments: true,
    messages: true,
    reviews: true,
    reminders: true,
  });

  // SMS Notifications
  const [smsPrefs, setSmsPrefs] = useState({
    bookings: true,
    payments: false,
    reminders: true,
  });

  const handleEmailChange = (key) => {
    setEmailPrefs({ ...emailPrefs, [key]: !emailPrefs[key] });
  };

  const handlePushChange = (key) => {
    setPushPrefs({ ...pushPrefs, [key]: !pushPrefs[key] });
  };

  const handleSmsChange = (key) => {
    setSmsPrefs({ ...smsPrefs, [key]: !smsPrefs[key] });
  };

  const handleSave = () => {
    toast({
      title: 'Preferences Saved',
      description: 'Your notification preferences have been updated.',
      status: 'success',
      duration: 3000,
    });
  };

  return (
    <Box bg="gray.50" minH="100vh" py={8}>
      <Container maxW="container.md">
        {/* Header */}
        <VStack align="start" spacing={2} mb={8}>
          <Heading size="lg">Notification Preferences</Heading>
          <Text color="gray.600">
            Choose how you want to receive notifications
          </Text>
        </VStack>

        {/* Notification Channels */}
        <VStack align="stretch" spacing={6}>
          {/* Email Notifications */}
          <Box
            bg="white"
            p={6}
            borderRadius="lg"
            border="1px"
            borderColor="gray.200"
          >
            <HStack spacing={3} mb={4}>
              <Box bg="primary.50" p={2} borderRadius="lg">
                <Icon as={FiMail} boxSize={5} color="primary.600" />
              </Box>
              <VStack align="start" spacing={0}>
                <Text fontWeight="semibold">Email Notifications</Text>
                <Text fontSize="sm" color="gray.600">
                  Receive notifications via email
                </Text>
              </VStack>
            </HStack>

            <Divider mb={4} />

            <VStack align="stretch" spacing={3}>
              <PreferenceItem
                label="Booking Updates"
                description="Get notified about booking confirmations and changes"
                checked={emailPrefs.bookings}
                onChange={() => handleEmailChange('bookings')}
              />
              <PreferenceItem
                label="Payment Confirmations"
                description="Receive payment receipts and transaction updates"
                checked={emailPrefs.payments}
                onChange={() => handleEmailChange('payments')}
              />
              <PreferenceItem
                label="New Messages"
                description="Get notified when you receive new messages"
                checked={emailPrefs.messages}
                onChange={() => handleEmailChange('messages')}
              />
              <PreferenceItem
                label="Reviews & Ratings"
                description="Notifications about new reviews on your properties"
                checked={emailPrefs.reviews}
                onChange={() => handleEmailChange('reviews')}
              />
              <PreferenceItem
                label="Reminders"
                description="Visit reminders and important deadlines"
                checked={emailPrefs.reminders}
                onChange={() => handleEmailChange('reminders')}
              />
              <PreferenceItem
                label="Marketing & Updates"
                description="Product updates, tips, and special offers"
                checked={emailPrefs.marketing}
                onChange={() => handleEmailChange('marketing')}
              />
            </VStack>
          </Box>

          {/* Push Notifications */}
          <Box
            bg="white"
            p={6}
            borderRadius="lg"
            border="1px"
            borderColor="gray.200"
          >
            <HStack spacing={3} mb={4}>
              <Box bg="success.50" p={2} borderRadius="lg">
                <Icon as={FiBell} boxSize={5} color="success.600" />
              </Box>
              <VStack align="start" spacing={0}>
                <Text fontWeight="semibold">Push Notifications</Text>
                <Text fontSize="sm" color="gray.600">
                  Instant notifications on your device
                </Text>
              </VStack>
            </HStack>

            <Divider mb={4} />

            <VStack align="stretch" spacing={3}>
              <PreferenceItem
                label="Booking Updates"
                description="Real-time booking notifications"
                checked={pushPrefs.bookings}
                onChange={() => handlePushChange('bookings')}
              />
              <PreferenceItem
                label="Payment Confirmations"
                description="Instant payment confirmations"
                checked={pushPrefs.payments}
                onChange={() => handlePushChange('payments')}
              />
              <PreferenceItem
                label="New Messages"
                description="Instant message notifications"
                checked={pushPrefs.messages}
                onChange={() => handlePushChange('messages')}
              />
              <PreferenceItem
                label="Reviews & Ratings"
                description="Notifications about new reviews"
                checked={pushPrefs.reviews}
                onChange={() => handlePushChange('reviews')}
              />
              <PreferenceItem
                label="Reminders"
                description="Important reminders and alerts"
                checked={pushPrefs.reminders}
                onChange={() => handlePushChange('reminders')}
              />
            </VStack>
          </Box>

          {/* SMS Notifications */}
          <Box
            bg="white"
            p={6}
            borderRadius="lg"
            border="1px"
            borderColor="gray.200"
          >
            <HStack spacing={3} mb={4}>
              <Box bg="purple.50" p={2} borderRadius="lg">
                <Icon as={FiSmartphone} boxSize={5} color="purple.600" />
              </Box>
              <VStack align="start" spacing={0}>
                <Text fontWeight="semibold">SMS Notifications</Text>
                <Text fontSize="sm" color="gray.600">
                  Important updates via text message
                </Text>
              </VStack>
            </HStack>

            <Divider mb={4} />

            <VStack align="stretch" spacing={3}>
              <PreferenceItem
                label="Booking Confirmations"
                description="SMS confirmation for bookings"
                checked={smsPrefs.bookings}
                onChange={() => handleSmsChange('bookings')}
              />
              <PreferenceItem
                label="Payment Confirmations"
                description="SMS receipts for payments"
                checked={smsPrefs.payments}
                onChange={() => handleSmsChange('payments')}
              />
              <PreferenceItem
                label="Visit Reminders"
                description="SMS reminders before scheduled visits"
                checked={smsPrefs.reminders}
                onChange={() => handleSmsChange('reminders')}
              />
            </VStack>

            <Box
              mt={4}
              p={3}
              bg="blue.50"
              borderRadius="md"
              fontSize="sm"
            >
              <Text color="blue.700">
                💡 Standard SMS rates may apply. We only send important notifications via SMS.
              </Text>
            </Box>
          </Box>

          {/* Save Button */}
          <Button
            leftIcon={<Icon as={FiSave} />}
            colorScheme="primary"
            size="lg"
            onClick={handleSave}
          >
            Save Preferences
          </Button>
        </VStack>
      </Container>
    </Box>
  );
};

export default NotificationPreferencesPage;
