import { useState } from 'react';
import { Box, Flex, Text, Badge, Select } from '@chakra-ui/react';
import { FiCheckCircle, FiAlertTriangle, FiMessageSquare, FiTrash2, FiEdit } from 'react-icons/fi';
import useAdminStore from '../../../../shared/stores/useAdminStore';
import useAuditLogStore from '../../../../shared/stores/useAuditLogStore';
import { useAuth } from '../../../../app/providers/AuthProvider';
import DataTable from '../../../../shared/components/DataTable';
import TableToolbar from '../../../../shared/components/TableToolbar';
import { TableSkeleton } from '../../../../shared/components/LoadingState';
import { useMinDisplayTime } from '../../../../shared/hooks/useMinDisplayTime';
import { useAppToast } from '../../../../shared/hooks/useAppToast';
import { confirmAction } from '../../../../shared/utils/confirm';

const TYPE_COLORS = { property: 'blue', user: 'purple', payment: 'orange' };
const STATUS_COLORS = { open: 'red', investigating: 'yellow', resolved: 'green' };
const PRIORITY_COLORS = { high: 'red', medium: 'yellow', low: 'green' };

/** Reported Issues — same DataTable/right-click-context-menu standard as every other admin table. */
export function ReportedIssuesList({ onEditReport, addLabel, onAdd }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const toast = useAppToast();
  const { user: actor } = useAuth();
  const isLoading = useMinDisplayTime();

  const allReports = useAdminStore((state) => state.reports);
  const resolveReport = useAdminStore((state) => state.resolveReport);
  const investigateReport = useAdminStore((state) => state.investigateReport);
  const deleteReport = useAdminStore((state) => state.deleteReport);
  const logAction = useAuditLogStore((state) => state.logAction);

  const reports = allReports.filter((report) => {
    const matchesSearch =
      !searchQuery ||
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reporter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reportedItem.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || report.priority === priorityFilter;
    return matchesSearch && matchesType && matchesStatus && matchesPriority;
  });

  const handleResolve = (report) => {
    resolveReport(report.id);
    logAction({ actorEmail: actor?.email, actorName: actor?.name, action: 'report.resolved', target: `Report #${report.id}` });
    toast({ title: 'Issue Resolved', description: `Report #${report.id} has been marked as resolved.`, status: 'success' });
  };

  const handleInvestigate = (report) => {
    investigateReport(report.id);
    logAction({ actorEmail: actor?.email, actorName: actor?.name, action: 'report.investigating', target: `Report #${report.id}` });
    toast({ title: 'Investigation Started', description: `Report #${report.id} is now under investigation.`, status: 'info' });
  };

  const handleDelete = async (report) => {
    const confirmed = await confirmAction({ title: 'Delete Report', text: `Delete report #${report.id}? This cannot be undone.`, isDestructive: true, confirmButtonText: 'Delete' });
    if (!confirmed) return;
    deleteReport(report.id);
    logAction({ actorEmail: actor?.email, actorName: actor?.name, action: 'report.deleted', target: `Report #${report.id}` });
    toast({ title: 'Report Deleted', description: `Report #${report.id} has been removed.`, status: 'info' });
  };

  const columns = [
    {
      key: 'title',
      label: 'Report',
      sortable: true,
      render: (r) => (
        <Box maxW="260px">
          <Text fontWeight="semibold" fontSize="sm" noOfLines={1}>{r.title}</Text>
          <Text fontSize="xs" color="gray.600" noOfLines={1}>{r.description}</Text>
        </Box>
      ),
    },
    { key: 'type', label: 'Type', sortable: true, render: (r) => <Badge colorScheme={TYPE_COLORS[r.type] || 'gray'} borderRadius="md">{r.type}</Badge> },
    { key: 'status', label: 'Status', sortable: true, render: (r) => <Badge colorScheme={STATUS_COLORS[r.status] || 'gray'} borderRadius="md">{r.status}</Badge> },
    { key: 'priority', label: 'Priority', sortable: true, render: (r) => <Badge colorScheme={PRIORITY_COLORS[r.priority] || 'gray'} borderRadius="md">{r.priority}</Badge> },
    { key: 'reporter', label: 'Reporter', sortable: true },
    { key: 'reportedItem', label: 'Against', sortable: true },
    { key: 'created', label: 'Reported', render: (r) => r.created },
  ];

  const getRowActions = (report) => [
    {
      label: 'Contact Reporter',
      icon: FiMessageSquare,
      onClick: () => toast({ title: 'Not available yet', description: "Direct messaging isn't supported in this preview.", status: 'info' }),
    },
    { label: 'Edit Report', icon: FiEdit, onClick: () => onEditReport?.(report) },
    ...(report.status !== 'resolved'
      ? [
          { label: 'Mark as Resolved', icon: FiCheckCircle, onClick: () => handleResolve(report) },
          { label: 'Start Investigation', icon: FiAlertTriangle, onClick: () => handleInvestigate(report) },
        ]
      : []),
    { label: 'Delete Report', icon: FiTrash2, isDestructive: true, onClick: () => handleDelete(report) },
  ];

  return (
    <Box>
      <TableToolbar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by title, reporter, or reported item..."
        filtersOpen={filtersOpen}
        onToggleFilters={() => setFiltersOpen((prev) => !prev)}
        addLabel={addLabel}
        onAdd={onAdd}
      >
        <Flex wrap="wrap" gap={4}>
          <Select flex="1" minW={{ base: '100%', sm: '160px' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
          </Select>
          <Select flex="1" minW={{ base: '100%', sm: '160px' }} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="all">All Types</option>
            <option value="property">Property</option>
            <option value="user">User</option>
            <option value="payment">Payment</option>
          </Select>
          <Select flex="1" minW={{ base: '100%', sm: '160px' }} value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </Select>
        </Flex>
      </TableToolbar>

      {isLoading ? (
        <TableSkeleton rows={5} columns={7} />
      ) : (
        <DataTable
          columns={columns}
          data={reports}
          getRowKey={(r) => r.id}
          getRowActions={getRowActions}
          emptyState="No reports match your search or filters."
        />
      )}
    </Box>
  );
}

export default ReportedIssuesList;
