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
  Icon,
} from '@chakra-ui/react';
import { FiSave } from 'react-icons/fi';
import useAdminStore from '../../../../shared/stores/useAdminStore';
import useAuditLogStore from '../../../../shared/stores/useAuditLogStore';
import { useAuth } from '../../../../app/providers/AuthProvider';
import { useAppToast } from '../../../../shared/hooks/useAppToast';

const SettingsSection = ({ title, children }) => (
  <Box bg="white" p={6} borderRadius="lg" border="1px" borderColor="gray.200">
    <Text fontSize="lg" fontWeight="bold" mb={4}>{title}</Text>
    <VStack spacing={4} align="stretch">{children}</VStack>
  </Box>
);

const ToggleRow = ({ label, description, isChecked, onChange }) => (
  <HStack justify="space-between">
    <Box>
      <Text fontWeight="medium">{label}</Text>
      <Text fontSize="sm" color="gray.600">{description}</Text>
    </Box>
    <Switch isChecked={isChecked} onChange={onChange} colorScheme="green" size="lg" />
  </HStack>
);

/** Platform Settings — moved from SystemSettings.jsx, logic unchanged. */
const PlatformSettingsForm = () => {
  const toast = useAppToast();
  const { user: actor } = useAuth();
  const settings = useAdminStore((state) => state.settings);
  const updateSettings = useAdminStore((state) => state.updateSettings);
  const logAction = useAuditLogStore((state) => state.logAction);
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
    logAction({ actorEmail: actor?.email, actorName: actor?.name, action: 'settings.updated', target: 'Platform Settings' });
    toast({ title: 'Settings Saved', description: 'System settings have been updated successfully.', status: 'success' });
  };

  return (
    <VStack spacing={6} align="stretch">
      <SettingsSection title="General Settings">
        <FormControl>
          <FormLabel>Platform Name</FormLabel>
          <Input value={draft.platformName} onChange={(e) => setField(['platformName'], e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Support Email</FormLabel>
          <Input type="email" value={draft.supportEmail} onChange={(e) => setField(['supportEmail'], e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Contact Phone</FormLabel>
          <Input value={draft.contactPhone} onChange={(e) => setField(['contactPhone'], e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Platform Description</FormLabel>
          <Textarea value={draft.platformDescription} onChange={(e) => setField(['platformDescription'], e.target.value)} rows={3} />
        </FormControl>
      </SettingsSection>

      <SettingsSection title="Feature Toggles">
        <ToggleRow label="User Registration" description="Allow new users to register on the platform" isChecked={draft.features.userRegistration} onChange={(e) => setField(['features', 'userRegistration'], e.target.checked)} />
        <Divider />
        <ToggleRow label="Property Listings" description="Allow owners to create new property listings" isChecked={draft.features.propertyListings} onChange={(e) => setField(['features', 'propertyListings'], e.target.checked)} />
        <Divider />
        <ToggleRow label="Online Booking" description="Enable online booking functionality" isChecked={draft.features.onlineBooking} onChange={(e) => setField(['features', 'onlineBooking'], e.target.checked)} />
        <Divider />
        <ToggleRow label="Payment Processing" description="Enable payment gateway for transactions" isChecked={draft.features.paymentProcessing} onChange={(e) => setField(['features', 'paymentProcessing'], e.target.checked)} />
        <Divider />
        <ToggleRow label="Chat & Messaging" description="Allow users to communicate via chat" isChecked={draft.features.chatMessaging} onChange={(e) => setField(['features', 'chatMessaging'], e.target.checked)} />
        <Divider />
        <ToggleRow label="Reviews & Ratings" description="Allow tenants to leave reviews" isChecked={draft.features.reviewsRatings} onChange={(e) => setField(['features', 'reviewsRatings'], e.target.checked)} />
      </SettingsSection>

      <SettingsSection title="Moderation Settings">
        <ToggleRow label="Auto-Approve Properties" description="Automatically approve new property listings" isChecked={draft.moderation.autoApproveProperties} onChange={(e) => setField(['moderation', 'autoApproveProperties'], e.target.checked)} />
        <Divider />
        <ToggleRow label="Manual Review Required" description="Require manual review for all new listings" isChecked={draft.moderation.manualReviewRequired} onChange={(e) => setField(['moderation', 'manualReviewRequired'], e.target.checked)} />
        <Divider />
        <FormControl>
          <FormLabel>Approval Time Limit</FormLabel>
          <Select value={draft.moderation.approvalTimeLimit} onChange={(e) => setField(['moderation', 'approvalTimeLimit'], e.target.value)}>
            <option value="24">24 hours</option>
            <option value="48">48 hours</option>
            <option value="72">72 hours</option>
            <option value="168">1 week</option>
          </Select>
          <FormHelperText>Maximum time to review and approve listings</FormHelperText>
        </FormControl>
      </SettingsSection>

      <SettingsSection title="Email Settings">
        <ToggleRow label="Email Notifications" description="Send email notifications to users" isChecked={draft.email.emailNotifications} onChange={(e) => setField(['email', 'emailNotifications'], e.target.checked)} />
        <Divider />
        <ToggleRow label="Marketing Emails" description="Send promotional and marketing emails" isChecked={draft.email.marketingEmails} onChange={(e) => setField(['email', 'marketingEmails'], e.target.checked)} />
      </SettingsSection>

      <Button leftIcon={<Icon as={FiSave} />} colorScheme="primary" size="lg" onClick={handleSave}>
        Save All Settings
      </Button>
    </VStack>
  );
};

export default PlatformSettingsForm;
