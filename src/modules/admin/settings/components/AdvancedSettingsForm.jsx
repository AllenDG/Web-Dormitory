import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  FormHelperText,
  NumberInput,
  NumberInputField,
  Switch,
  Alert,
  AlertIcon,
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

/**
 * Advanced Settings — platform-operator-tier configuration that didn't
 * exist anywhere before: maintenance mode, upload limits, session policy,
 * and data export. Distinct from System Settings' feature toggles/
 * moderation policy, which stays focused on end-user-facing behavior.
 */
const AdvancedSettingsForm = () => {
  const toast = useAppToast();
  const { user: actor } = useAuth();
  const settings = useAdminStore((state) => state.settings);
  const updateSettings = useAdminStore((state) => state.updateSettings);
  const logAction = useAuditLogStore((state) => state.logAction);
  const [draft, setDraft] = useState(settings.advanced);

  const setField = (field, value) => setDraft((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    updateSettings({ advanced: draft });
    logAction({ actorEmail: actor?.email, actorName: actor?.name, action: 'settings.updated', target: 'Advanced Settings' });
    toast({ title: 'Advanced Settings Saved', status: 'success' });
  };

  return (
    <VStack spacing={6} align="stretch">
      {draft.maintenanceMode && (
        <Alert status="warning" borderRadius="lg">
          <AlertIcon />
          Maintenance mode is currently enabled. Consider sending an Announcement to notify Owners and Tenants.
        </Alert>
      )}

      <SettingsSection title="Maintenance Mode">
        <ToggleRow
          label="Enable Maintenance Mode"
          description="Signals that the platform is undergoing maintenance"
          isChecked={draft.maintenanceMode}
          onChange={(e) => setField('maintenanceMode', e.target.checked)}
        />
        <FormControl>
          <FormLabel>Maintenance Message</FormLabel>
          <Textarea value={draft.maintenanceMessage} onChange={(e) => setField('maintenanceMessage', e.target.value)} rows={2} />
        </FormControl>
      </SettingsSection>

      <SettingsSection title="Upload Limits">
        <FormControl>
          <FormLabel>Max File Upload Size (MB)</FormLabel>
          <NumberInput min={1} max={100} value={draft.fileUploadMaxSizeMb} onChange={(_, val) => setField('fileUploadMaxSizeMb', val)}>
            <NumberInputField />
          </NumberInput>
        </FormControl>
        <FormControl>
          <FormLabel>Max Images per Listing</FormLabel>
          <NumberInput min={1} max={20} value={draft.maxImagesPerListing} onChange={(_, val) => setField('maxImagesPerListing', val)}>
            <NumberInputField />
          </NumberInput>
        </FormControl>
      </SettingsSection>

      <SettingsSection title="Session & Data">
        <FormControl>
          <FormLabel>Session Timeout (minutes)</FormLabel>
          <NumberInput min={5} max={1440} value={draft.sessionTimeoutMinutes} onChange={(_, val) => setField('sessionTimeoutMinutes', val)}>
            <NumberInputField />
          </NumberInput>
          <FormHelperText>How long an inactive session stays logged in</FormHelperText>
        </FormControl>
        <ToggleRow
          label="Data Export"
          description="Allow admins to export platform data (e.g. audit log CSV)"
          isChecked={draft.dataExportEnabled}
          onChange={(e) => setField('dataExportEnabled', e.target.checked)}
        />
      </SettingsSection>

      <Button leftIcon={<Icon as={FiSave} />} colorScheme="primary" size="lg" onClick={handleSave} alignSelf="start">
        Save Advanced Settings
      </Button>
    </VStack>
  );
};

export default AdvancedSettingsForm;
