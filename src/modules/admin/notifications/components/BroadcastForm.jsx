import {
  Box,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Button,
  Icon,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiSend } from 'react-icons/fi';
import useAnnouncementStore from '../../../../shared/stores/useAnnouncementStore';
import useAuditLogStore from '../../../../shared/stores/useAuditLogStore';
import { useAuth } from '../../../../app/providers/AuthProvider';
import { useAppToast } from '../../../../shared/hooks/useAppToast';

const EMPTY_FORM = { title: '', message: '', severity: 'info', audience: 'all', expiresAt: '' };

/**
 * Broadcast compose form — sends a platform-wide announcement (system
 * error, maintenance, enhancement) to Owners and/or Tenants. Fans out via
 * useAnnouncementStore.broadcastAnnouncement, which writes one
 * useNotificationStore entry per matching recipient — the existing bell
 * icon needs no changes to render these.
 */
const BroadcastForm = () => {
  const toast = useAppToast();
  const { user: actor } = useAuth();
  const broadcastAnnouncement = useAnnouncementStore((state) => state.broadcastAnnouncement);
  const logAction = useAuditLogStore((state) => state.logAction);
  const [form, setForm] = useState(EMPTY_FORM);

  const setField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSend = () => {
    if (!form.title || !form.message) {
      toast({ title: 'Title and message are required', status: 'warning' });
      return;
    }

    const { recipientCount } = broadcastAnnouncement({
      ...form,
      expiresAt: form.expiresAt || null,
      createdByEmail: actor?.email,
      createdByName: actor?.name,
    });

    logAction({ actorEmail: actor?.email, actorName: actor?.name, action: 'notification.broadcast_sent', target: form.title, details: `${form.audience}, ${recipientCount} recipients` });
    toast({ title: 'Announcement Sent', description: `Sent to ${recipientCount} recipient${recipientCount === 1 ? '' : 's'}.`, status: 'success' });
    setForm(EMPTY_FORM);
  };

  return (
    <Box bg="white" p={6} borderRadius="lg" border="1px" borderColor="gray.200" mb={8}>
      <VStack spacing={5} align="stretch">
        <FormControl isRequired>
          <FormLabel>Title</FormLabel>
          <Input value={form.title} onChange={(e) => setField('title', e.target.value)} placeholder="e.g. Scheduled Maintenance Tonight" />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Message</FormLabel>
          <Textarea value={form.message} onChange={(e) => setField('message', e.target.value)} rows={3} placeholder="Details for the recipients..." />
        </FormControl>

        <HStack spacing={4} align="start">
          <FormControl isRequired>
            <FormLabel>Severity</FormLabel>
            <Select value={form.severity} onChange={(e) => setField('severity', e.target.value)}>
              <option value="info">Info</option>
              <option value="success">Success / Enhancement</option>
              <option value="warning">Warning / Maintenance</option>
              <option value="error">Error / Incident</option>
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Audience</FormLabel>
            <Select value={form.audience} onChange={(e) => setField('audience', e.target.value)}>
              <option value="all">Owners & Tenants</option>
              <option value="owners">Owners Only</option>
              <option value="tenants">Tenants Only</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Expires (optional)</FormLabel>
            <Input type="date" value={form.expiresAt} onChange={(e) => setField('expiresAt', e.target.value)} />
          </FormControl>
        </HStack>

        <Button leftIcon={<Icon as={FiSend} />} colorScheme="primary" onClick={handleSend} alignSelf="start">
          Send Announcement
        </Button>
      </VStack>
    </Box>
  );
};

export default BroadcastForm;
