import { useState } from 'react';
import { Box, Button, HStack, Select, Icon } from '@chakra-ui/react';
import { FiTrash2 } from 'react-icons/fi';
import useAuditLogStore from '../../../shared/stores/useAuditLogStore';
import PageBanner from '../../../shared/components/PageBanner';
import DataTable from '../../../shared/components/DataTable';
import { TableSkeleton } from '../../../shared/components/LoadingState';
import { useMinDisplayTime } from '../../../shared/hooks/useMinDisplayTime';
import { useAppToast } from '../../../shared/hooks/useAppToast';
import { confirmAction } from '../../../shared/utils/confirm';

const formatTimestamp = (iso) => new Date(iso).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

/**
 * Audit Log — record of admin/owner actions taken through the app.
 * Genuinely empty until this session's admin actions populate it (writes
 * happen from Users/Properties/Reports/Settings action handlers).
 */
const AuditLogPage = () => {
  const [actionFilter, setActionFilter] = useState('all');
  const toast = useAppToast();
  const isLoading = useMinDisplayTime();
  const logs = useAuditLogStore((state) => state.logs);
  const clearLogs = useAuditLogStore((state) => state.clearLogs);

  const actionTypes = [...new Set(logs.map((l) => l.action))];
  const filteredLogs = actionFilter === 'all' ? logs : logs.filter((l) => l.action === actionFilter);

  const handleClear = async () => {
    const confirmed = await confirmAction({ title: 'Clear Audit Log', text: 'Delete every recorded entry? This cannot be undone.', isDestructive: true, confirmButtonText: 'Clear Log' });
    if (!confirmed) return;
    clearLogs();
    toast({ title: 'Audit Log Cleared', status: 'info' });
  };

  const columns = [
    { key: 'timestamp', label: 'Timestamp', sortable: true, render: (l) => formatTimestamp(l.timestamp) },
    { key: 'actorName', label: 'Actor', sortable: true, render: (l) => l.actorName || l.actorEmail || 'Unknown' },
    { key: 'action', label: 'Action', sortable: true },
    { key: 'target', label: 'Target', sortable: true },
    { key: 'details', label: 'Details' },
  ];

  return (
    <Box>
      <PageBanner
        title="Audit Log"
        subtitle="Record of admin and owner actions"
        actions={
          <Button leftIcon={<Icon as={FiTrash2} />} variant="outline" colorScheme="red" onClick={handleClear} isDisabled={logs.length === 0}>
            Clear Log
          </Button>
        }
      />

      <HStack mb={6}>
        <Select maxW="220px" value={actionFilter} onChange={(e) => setActionFilter(e.target.value)}>
          <option value="all">All Actions</option>
          {actionTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </Select>
      </HStack>

      {isLoading ? (
        <TableSkeleton rows={6} columns={5} />
      ) : (
        <DataTable
          columns={columns}
          data={filteredLogs}
          getRowKey={(l) => l.id}
          emptyState="No actions recorded yet — actions taken from Users, Properties, or Reports will appear here."
        />
      )}
    </Box>
  );
};

export default AuditLogPage;
