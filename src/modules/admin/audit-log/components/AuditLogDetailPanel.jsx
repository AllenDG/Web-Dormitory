import { VStack, Box, Text } from '@chakra-ui/react';
import SidePanel from '../../../../shared/components/SidePanel';
import { FiFileText } from 'react-icons/fi';

const formatTimestamp = (iso) => new Date(iso).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'medium' });

const DetailRow = ({ label, value }) => (
  <Box>
    <Text fontSize="xs" color="gray.600" mb={1}>{label}</Text>
    <Text fontSize="sm" fontWeight="medium">{value || '—'}</Text>
  </Box>
);

/** Read-only audit log entry detail — the only DataTable in the admin module without a getRowActions before this. */
const AuditLogDetailPanel = ({ isOpen, onClose, log }) => {
  if (!log) return null;

  return (
    <SidePanel isOpen={isOpen} onClose={onClose} title="Audit Log Entry" icon={FiFileText} size="md">
      <VStack spacing={6} align="stretch">
        <DetailRow label="Timestamp" value={formatTimestamp(log.timestamp)} />
        <DetailRow label="Actor" value={log.actorName || log.actorEmail || 'Unknown'} />
        <DetailRow label="Actor Email" value={log.actorEmail} />
        <DetailRow label="Action" value={log.action} />
        <DetailRow label="Target" value={log.target} />
        <DetailRow label="Details" value={log.details} />
      </VStack>
    </SidePanel>
  );
};

export default AuditLogDetailPanel;
