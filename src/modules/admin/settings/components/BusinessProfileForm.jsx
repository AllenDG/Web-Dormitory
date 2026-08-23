import { useState } from 'react';
import {
  Box,
  VStack,
  Text,
  Button,
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  Icon,
} from '@chakra-ui/react';
import { FiSave } from 'react-icons/fi';
import useAdminStore from '../../../../shared/stores/useAdminStore';
import useAuditLogStore from '../../../../shared/stores/useAuditLogStore';
import { useAuth } from '../../../../app/providers/AuthProvider';
import { useAppToast } from '../../../../shared/hooks/useAppToast';
import ImageUploadField from '../../../../shared/components/ImageUploadField';

const SettingsSection = ({ title, children }) => (
  <Box bg="white" p={6} borderRadius="lg" border="1px" borderColor="gray.200">
    <Text fontSize="lg" fontWeight="bold" mb={4}>{title}</Text>
    <VStack spacing={4} align="stretch">{children}</VStack>
  </Box>
);

/**
 * Business Profile — the identity of the Main Business that owns and runs
 * the platform, distinct from the logged-in admin's own personal profile
 * (that's ProfileSettingsForm). This is genuinely new: no legal name, tax
 * ID, registration number, or logo concept existed anywhere before.
 */
const BusinessProfileForm = () => {
  const toast = useAppToast();
  const { user: actor } = useAuth();
  const settings = useAdminStore((state) => state.settings);
  const updateSettings = useAdminStore((state) => state.updateSettings);
  const logAction = useAuditLogStore((state) => state.logAction);
  const [draft, setDraft] = useState(settings.business);

  const setField = (field, value) => setDraft((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    updateSettings({ business: draft });
    logAction({ actorEmail: actor?.email, actorName: actor?.name, action: 'settings.updated', target: 'Business Profile' });
    toast({ title: 'Business Profile Saved', status: 'success' });
  };

  return (
    <VStack spacing={6} align="stretch">
      <SettingsSection title="Business Identity">
        <FormControl>
          <FormLabel>Legal Name</FormLabel>
          <Input value={draft.legalName} onChange={(e) => setField('legalName', e.target.value)} placeholder="e.g. RentMe Technologies Inc." />
        </FormControl>
        <FormControl>
          <FormLabel>Trade Name</FormLabel>
          <Input value={draft.tradeName} onChange={(e) => setField('tradeName', e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Business Registration Number</FormLabel>
          <Input value={draft.registrationNumber} onChange={(e) => setField('registrationNumber', e.target.value)} placeholder="SEC/DTI registration number" />
        </FormControl>
        <FormControl>
          <FormLabel>Tax ID (TIN)</FormLabel>
          <Input value={draft.taxId} onChange={(e) => setField('taxId', e.target.value)} placeholder="BIR TIN" />
        </FormControl>
      </SettingsSection>

      <SettingsSection title="Business Contact">
        <FormControl>
          <FormLabel>Business Address</FormLabel>
          <Input value={draft.businessAddress} onChange={(e) => setField('businessAddress', e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Support Phone</FormLabel>
          <Input value={draft.supportPhone} onChange={(e) => setField('supportPhone', e.target.value)} placeholder="+63 912 345 6789" />
        </FormControl>
      </SettingsSection>

      <SettingsSection title="Branding">
        <FormControl>
          <FormLabel>Logo</FormLabel>
          <ImageUploadField
            value={draft.logoUrl ? [draft.logoUrl] : []}
            onChange={(images) => setField('logoUrl', images[images.length - 1] || '')}
          />
          <FormHelperText>Uploading a new image replaces the current logo.</FormHelperText>
        </FormControl>
      </SettingsSection>

      <Button leftIcon={<Icon as={FiSave} />} colorScheme="primary" size="lg" onClick={handleSave} alignSelf="start">
        Save Business Profile
      </Button>
    </VStack>
  );
};

export default BusinessProfileForm;
