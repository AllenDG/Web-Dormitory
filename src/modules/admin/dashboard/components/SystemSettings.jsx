import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Switch,
  Button,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  FormHelperText,
  Select,
  Divider,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { FiSave } from 'react-icons/fi';
import useAdminStore from '../../../../shared/stores/useAdminStore';

/**
 * SystemSettings Component
 * Manage platform-wide settings and configurations
 */
export function SystemSettings() {
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const settings = useAdminStore((state) => state.settings);
  const updateSettings = useAdminStore((state) => state.updateSettings);
  const [draft, setDraft] = useState(settings);

  const setField = (path, value) => {
    setDraft((prev) => {
      const next = { ...prev };
      if (path.length === 1) {
        next[path[0]] = value;
      } else {
        next[path[0]] = { ...prev[path[0]], [path[1]]: value };
      }
      return next;
    });
  };

  const handleSave = () => {
    updateSettings(draft);
    toast({
      title: 'Settings Saved',
      description: 'System settings have been updated successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* General Settings */}
      <Box
        bg={bgColor}
        p={6}
        borderRadius="8px"
        border="1px"
        borderColor={borderColor}
      >
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          General Settings
        </Text>

        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>Platform Name</FormLabel>
            <Input
              value={draft.platformName}
              onChange={(e) => setField(['platformName'], e.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Support Email</FormLabel>
            <Input
              type="email"
              value={draft.supportEmail}
              onChange={(e) => setField(['supportEmail'], e.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Contact Phone</FormLabel>
            <Input
              value={draft.contactPhone}
              onChange={(e) => setField(['contactPhone'], e.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Platform Description</FormLabel>
            <Textarea
              value={draft.platformDescription}
              onChange={(e) => setField(['platformDescription'], e.target.value)}
              rows={3}
            />
          </FormControl>
        </VStack>
      </Box>

      {/* Feature Toggles */}
      <Box
        bg={bgColor}
        p={6}
        borderRadius="8px"
        border="1px"
        borderColor={borderColor}
      >
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Feature Toggles
        </Text>

        <VStack spacing={4} align="stretch">
          <HStack justify="space-between">
            <Box>
              <Text fontWeight="medium">User Registration</Text>
              <Text fontSize="sm" color="gray.600">
                Allow new users to register on the platform
              </Text>
            </Box>
            <Switch
              isChecked={draft.features.userRegistration}
              onChange={(e) => setField(['features', 'userRegistration'], e.target.checked)}
              colorScheme="green"
              size="lg"
            />
          </HStack>

          <Divider />

          <HStack justify="space-between">
            <Box>
              <Text fontWeight="medium">Property Listings</Text>
              <Text fontSize="sm" color="gray.600">
                Allow owners to create new property listings
              </Text>
            </Box>
            <Switch
              isChecked={draft.features.propertyListings}
              onChange={(e) => setField(['features', 'propertyListings'], e.target.checked)}
              colorScheme="green"
              size="lg"
            />
          </HStack>

          <Divider />

          <HStack justify="space-between">
            <Box>
              <Text fontWeight="medium">Online Booking</Text>
              <Text fontSize="sm" color="gray.600">
                Enable online booking functionality
              </Text>
            </Box>
            <Switch
              isChecked={draft.features.onlineBooking}
              onChange={(e) => setField(['features', 'onlineBooking'], e.target.checked)}
              colorScheme="green"
              size="lg"
            />
          </HStack>

          <Divider />

          <HStack justify="space-between">
            <Box>
              <Text fontWeight="medium">Payment Processing</Text>
              <Text fontSize="sm" color="gray.600">
                Enable payment gateway for transactions
              </Text>
            </Box>
            <Switch
              isChecked={draft.features.paymentProcessing}
              onChange={(e) => setField(['features', 'paymentProcessing'], e.target.checked)}
              colorScheme="green"
              size="lg"
            />
          </HStack>

          <Divider />

          <HStack justify="space-between">
            <Box>
              <Text fontWeight="medium">Chat & Messaging</Text>
              <Text fontSize="sm" color="gray.600">
                Allow users to communicate via chat
              </Text>
            </Box>
            <Switch
              isChecked={draft.features.chatMessaging}
              onChange={(e) => setField(['features', 'chatMessaging'], e.target.checked)}
              colorScheme="green"
              size="lg"
            />
          </HStack>

          <Divider />

          <HStack justify="space-between">
            <Box>
              <Text fontWeight="medium">Reviews & Ratings</Text>
              <Text fontSize="sm" color="gray.600">
                Allow tenants to leave reviews
              </Text>
            </Box>
            <Switch
              isChecked={draft.features.reviewsRatings}
              onChange={(e) => setField(['features', 'reviewsRatings'], e.target.checked)}
              colorScheme="green"
              size="lg"
            />
          </HStack>
        </VStack>
      </Box>

      {/* Moderation Settings */}
      <Box
        bg={bgColor}
        p={6}
        borderRadius="8px"
        border="1px"
        borderColor={borderColor}
      >
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Moderation Settings
        </Text>

        <VStack spacing={4} align="stretch">
          <HStack justify="space-between">
            <Box>
              <Text fontWeight="medium">Auto-Approve Properties</Text>
              <Text fontSize="sm" color="gray.600">
                Automatically approve new property listings
              </Text>
            </Box>
            <Switch
              isChecked={draft.moderation.autoApproveProperties}
              onChange={(e) => setField(['moderation', 'autoApproveProperties'], e.target.checked)}
              colorScheme="green"
              size="lg"
            />
          </HStack>

          <Divider />

          <HStack justify="space-between">
            <Box>
              <Text fontWeight="medium">Manual Review Required</Text>
              <Text fontSize="sm" color="gray.600">
                Require manual review for all new listings
              </Text>
            </Box>
            <Switch
              isChecked={draft.moderation.manualReviewRequired}
              onChange={(e) => setField(['moderation', 'manualReviewRequired'], e.target.checked)}
              colorScheme="green"
              size="lg"
            />
          </HStack>

          <Divider />

          <FormControl>
            <FormLabel>Approval Time Limit</FormLabel>
            <Select
              value={draft.moderation.approvalTimeLimit}
              onChange={(e) => setField(['moderation', 'approvalTimeLimit'], e.target.value)}
            >
              <option value="24">24 hours</option>
              <option value="48">48 hours</option>
              <option value="72">72 hours</option>
              <option value="168">1 week</option>
            </Select>
            <FormHelperText>
              Maximum time to review and approve listings
            </FormHelperText>
          </FormControl>
        </VStack>
      </Box>

      {/* Email Settings */}
      <Box
        bg={bgColor}
        p={6}
        borderRadius="8px"
        border="1px"
        borderColor={borderColor}
      >
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Email Settings
        </Text>

        <VStack spacing={4} align="stretch">
          <HStack justify="space-between">
            <Box>
              <Text fontWeight="medium">Email Notifications</Text>
              <Text fontSize="sm" color="gray.600">
                Send email notifications to users
              </Text>
            </Box>
            <Switch
              isChecked={draft.email.emailNotifications}
              onChange={(e) => setField(['email', 'emailNotifications'], e.target.checked)}
              colorScheme="green"
              size="lg"
            />
          </HStack>

          <Divider />

          <HStack justify="space-between">
            <Box>
              <Text fontWeight="medium">Marketing Emails</Text>
              <Text fontSize="sm" color="gray.600">
                Send promotional and marketing emails
              </Text>
            </Box>
            <Switch
              isChecked={draft.email.marketingEmails}
              onChange={(e) => setField(['email', 'marketingEmails'], e.target.checked)}
              colorScheme="green"
              size="lg"
            />
          </HStack>
        </VStack>
      </Box>

      {/* Save Button */}
      <Button
        leftIcon={<FiSave />}
        colorScheme="blue"
        size="lg"
        onClick={handleSave}
      >
        Save All Settings
      </Button>
    </VStack>
  );
}
