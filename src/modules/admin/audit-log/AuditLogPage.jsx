import { useState, useMemo } from 'react';
import { Box, Button, HStack, Flex, Select, Icon, Input, useDisclosure } from '@chakra-ui/react';
import { FiTrash2, FiDownload, FiEye } from 'react-icons/fi';
import useAuditLogStore from '../../../shared/stores/useAuditLogStore';
import PageBanner from '../../../shared/components/PageBanner';
import DataTable from '../../../shared/components/DataTable';
import TableToolbar from '../../../shared/components/TableToolbar';
import { TableSkeleton } from '../../../shared/components/LoadingState';
import { useMinDisplayTime } from '../../../shared/hooks/useMinDisplayTime';
import { useAppToast } from '../../../shared/hooks/useAppToast';
import { confirmAction } from '../../../shared/utils/confirm';
import { exportLogsToCsv } from './utils/exportLogs';
import AuditLogDetailPanel from './components/AuditLogDetailPanel';

const getActors = (logs) => [...new Set(logs.map((l) => l.actorName || l.actorEmail).filter(Boolean))].sort();

const formatTimestamp = (iso) => new Date(iso).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

const CATEGORY_TITLES = {
  all: 'Audit Log',
  'user-actions': 'User Actions',
  'property-actions': 'Property Actions',
  'report-actions': 'Report Actions',
  'settings-actions': 'Settings & Broadcasts',
};

const CATEGORY_PREFIXES = {
  'user-actions': ['user.'],
  'property-actions': ['property.'],
  'report-actions': ['report.'],
  'settings-actions': ['settings.', 'notification.'],
};

/**
 * Audit Log — record of admin/owner actions taken through the app.
 * Genuinely empty until this session's admin actions populate it (writes
 * happen from Users/Properties/Reports/Revenue/Settings action handlers).
 * Deliberately no create/edit tier here — a fabricated entry would defeat
 * the log's purpose as a trust record, so this section only gains richer
 * oversight (category routing, export, drill-down), not a bypass tier.
 */
const AuditLogPage = ({ category = 'all' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [actionFilter, setActionFilter] = useState('all');
  const [actorFilter, setActorFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);
  const toast = useAppToast();
  const isLoading = useMinDisplayTime();
  const logs = useAuditLogStore((state) => state.logs);
  const clearLogs = useAuditLogStore((state) => state.clearLogs);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const categoryLogs =
    category === 'all'
      ? logs
      : logs.filter((l) => CATEGORY_PREFIXES[category]?.some((prefix) => l.action?.startsWith(prefix)));

  const actionTypes = [...new Set(categoryLogs.map((l) => l.action))];
  const actors = useMemo(() => getActors(categoryLogs), [categoryLogs]);

  const filteredLogs = categoryLogs.filter((l) => {
    const matchesSearch =
      !searchQuery ||
      (l.actorName && l.actorName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.actorEmail && l.actorEmail.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.action && l.action.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.target && l.target.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.details && l.details.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesAction = actionFilter === 'all' || l.action === actionFilter;
    const logActor = l.actorName || l.actorEmail;
    const matchesActor = actorFilter === 'all' || logActor === actorFilter;
    const logDate = new Date(l.timestamp);
    const fromDate = dateFrom ? new Date(dateFrom) : null;
    const toDate = dateTo ? new Date(dateTo) : null;
    const matchesDateRange = (!fromDate || logDate >= fromDate) && (!toDate || logDate <= toDate);
    return matchesSearch && matchesAction && matchesActor && matchesDateRange;
  });

  const handleClear = async () => {
    const confirmed = await confirmAction({ title: 'Clear Audit Log', text: 'Delete every recorded entry? This cannot be undone.', isDestructive: true, confirmButtonText: 'Clear Log' });
    if (!confirmed) return;
    clearLogs();
    toast({ title: 'Audit Log Cleared', status: 'info' });
  };

  const handleExport = () => {
    if (filteredLogs.length === 0) {
      toast({ title: 'Nothing to export', status: 'warning' });
      return;
    }
    exportLogsToCsv(filteredLogs);
    toast({ title: 'Export Started', description: `${filteredLogs.length} entries exported.`, status: 'success' });
  };

  const handleViewDetails = (log) => {
    setSelectedLog(log);
    onOpen();
  };

  const columns = [
    { key: 'timestamp', label: 'Timestamp', sortable: true, render: (l) => formatTimestamp(l.timestamp) },
    { key: 'actorName', label: 'Actor', sortable: true, render: (l) => l.actorName || l.actorEmail || 'Unknown' },
    { key: 'action', label: 'Action', sortable: true },
    { key: 'target', label: 'Target', sortable: true },
    { key: 'details', label: 'Details' },
  ];

  const getRowActions = (log) => [{ label: 'View Details', icon: FiEye, onClick: () => handleViewDetails(log) }];

  return (
    <Box>
      <PageBanner
        title={CATEGORY_TITLES[category]}
        subtitle="Record of admin and owner actions"
        actions={
          <HStack spacing={3}>
            <Button leftIcon={<Icon as={FiDownload} />} variant="outline" onClick={handleExport} isDisabled={filteredLogs.length === 0}>
              Export CSV
            </Button>
            <Button leftIcon={<Icon as={FiTrash2} />} variant="outline" colorScheme="red" onClick={handleClear} isDisabled={logs.length === 0}>
              Clear Log
            </Button>
          </HStack>
        }
      />

      <TableToolbar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by actor, action, target, or details..."
        filtersOpen={filtersOpen}
        onToggleFilters={() => setFiltersOpen((prev) => !prev)}
      >
        <Flex wrap="wrap" gap={4}>
          <Select flex="1" minW={{ base: '100%', sm: '200px' }} value={actionFilter} onChange={(e) => setActionFilter(e.target.value)}>
            <option value="all">All Actions</option>
            {actionTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </Select>
          <Select flex="1" minW={{ base: '100%', sm: '200px' }} value={actorFilter} onChange={(e) => setActorFilter(e.target.value)}>
            <option value="all">All Actors</option>
            {actors.map((actor) => (
              <option key={actor} value={actor}>{actor}</option>
            ))}
          </Select>
          <Input
            type="date"
            aria-label="From date"
            flex="1"
            minW={{ base: '100%', sm: '150px' }}
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <Input
            type="date"
            aria-label="To date"
            flex="1"
            minW={{ base: '100%', sm: '150px' }}
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </Flex>
      </TableToolbar>

      {isLoading ? (
        <TableSkeleton rows={6} columns={5} />
      ) : (
        <DataTable
          columns={columns}
          data={filteredLogs}
          getRowKey={(l) => l.id}
          getRowActions={getRowActions}
          emptyState="No actions recorded yet — actions taken from Users, Properties, Reports, or Revenue will appear here."
        />
      )}

      <AuditLogDetailPanel isOpen={isOpen} onClose={onClose} log={selectedLog} />
    </Box>
  );
};

export default AuditLogPage;
