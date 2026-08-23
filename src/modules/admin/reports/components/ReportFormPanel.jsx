import {
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Button,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import SidePanel from '../../../../shared/components/SidePanel';
import useAdminStore from '../../../../shared/stores/useAdminStore';
import useAuditLogStore from '../../../../shared/stores/useAuditLogStore';
import { useAuth } from '../../../../app/providers/AuthProvider';
import { useAppToast } from '../../../../shared/hooks/useAppToast';
import { FiFlag } from 'react-icons/fi';

const EMPTY_FORM = { type: 'property', title: '', description: '', reporter: '', reportedItem: '', priority: 'medium' };

/**
 * Add/Edit Report side panel — the buildup tier for Reported Issues. No
 * tenant/owner "Report a Problem" submission flow exists anywhere in the
 * app, so this is how Admin logs an issue that came in outside the app
 * (phone/email support intake), or corrects the details of an existing one.
 *
 * Props: { mode: 'add' | 'edit', report?, isOpen, onClose }
 */
const ReportFormPanel = ({ mode, report, isOpen, onClose }) => {
  const isEdit = mode === 'edit';
  const toast = useAppToast();
  const { user: actor } = useAuth();
  const addReport = useAdminStore((state) => state.addReport);
  const updateReport = useAdminStore((state) => state.updateReport);
  const logAction = useAuditLogStore((state) => state.logAction);

  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (isOpen) {
      setForm(
        isEdit && report
          ? {
              type: report.type,
              title: report.title,
              description: report.description,
              reporter: report.reporter,
              reportedItem: report.reportedItem,
              priority: report.priority,
            }
          : EMPTY_FORM
      );
    }
  }, [isOpen, isEdit, report]);

  const setField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    if (!form.title || !form.description || !form.reporter || !form.reportedItem) {
      toast({ title: 'All fields are required', status: 'warning' });
      return;
    }

    if (isEdit) {
      updateReport(report.id, form);
      logAction({ actorEmail: actor?.email, actorName: actor?.name, action: 'report.updated', target: form.title });
      toast({ title: 'Report Updated', status: 'success' });
    } else {
      addReport(form);
      logAction({ actorEmail: actor?.email, actorName: actor?.name, action: 'report.created', target: form.title });
      toast({ title: 'Report Logged', description: 'The report has been added to the queue.', status: 'success' });
    }
    onClose();
  };

  return (
    <SidePanel
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Report' : 'Log Report'}
      icon={FiFlag}
      footer={
        <HStack spacing={3} w="full">
          <Button variant="outline" onClick={onClose} flex={1}>Cancel</Button>
          <Button colorScheme="primary" onClick={handleSubmit} flex={1}>
            {isEdit ? 'Save Changes' : 'Log Report'}
          </Button>
        </HStack>
      }
    >
      <VStack spacing={5} align="stretch">
        <HStack spacing={4} align="start">
          <FormControl isRequired>
            <FormLabel>Type</FormLabel>
            <Select value={form.type} onChange={(e) => setField('type', e.target.value)}>
              <option value="property">Property</option>
              <option value="user">User</option>
              <option value="payment">Payment</option>
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Priority</FormLabel>
            <Select value={form.priority} onChange={(e) => setField('priority', e.target.value)}>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </Select>
          </FormControl>
        </HStack>

        <FormControl isRequired>
          <FormLabel>Title</FormLabel>
          <Input value={form.title} onChange={(e) => setField('title', e.target.value)} placeholder="Short summary of the issue" />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Description</FormLabel>
          <Textarea value={form.description} onChange={(e) => setField('description', e.target.value)} rows={4} placeholder="What happened?" />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Reporter</FormLabel>
          <Input value={form.reporter} onChange={(e) => setField('reporter', e.target.value)} placeholder="Who reported this?" />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Reported Item</FormLabel>
          <Input value={form.reportedItem} onChange={(e) => setField('reportedItem', e.target.value)} placeholder="e.g. property title, user name, transaction #" />
        </FormControl>
      </VStack>
    </SidePanel>
  );
};

export default ReportFormPanel;
