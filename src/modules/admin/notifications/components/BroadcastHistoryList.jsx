import { Badge, Text } from '@chakra-ui/react';
import useAnnouncementStore from '../../../../shared/stores/useAnnouncementStore';
import DataTable from '../../../../shared/components/DataTable';

const SEVERITY_COLORS = { info: 'blue', success: 'green', warning: 'yellow', error: 'red' };
const AUDIENCE_LABELS = { all: 'Owners & Tenants', owners: 'Owners', tenants: 'Tenants' };

const formatDate = (iso) => new Date(iso).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

/** Read-only history of past broadcasts — gives Admin oversight of what's already been sent, not just a fire-and-forget form. */
const BroadcastHistoryList = () => {
  const announcements = useAnnouncementStore((state) => state.announcements);

  const columns = [
    { key: 'title', label: 'Title', sortable: true },
    { key: 'audience', label: 'Audience', sortable: true, render: (a) => <Badge borderRadius="md">{AUDIENCE_LABELS[a.audience]}</Badge> },
    { key: 'severity', label: 'Severity', sortable: true, render: (a) => <Badge colorScheme={SEVERITY_COLORS[a.severity]} borderRadius="md">{a.severity}</Badge> },
    { key: 'createdAt', label: 'Sent', sortable: true, render: (a) => formatDate(a.createdAt) },
    { key: 'createdByName', label: 'Sent By', sortable: true, render: (a) => a.createdByName || a.createdByEmail || 'Unknown' },
  ];

  return (
    <>
      <Text fontSize="lg" fontWeight="bold" mb={4}>Broadcast History</Text>
      <DataTable
        columns={columns}
        data={announcements}
        getRowKey={(a) => a.id}
        emptyState="No announcements sent yet."
      />
    </>
  );
};

export default BroadcastHistoryList;
