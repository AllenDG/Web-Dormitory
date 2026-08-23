import { useState } from 'react';
import { Box, VStack, HStack, Flex, Text, Badge, Button, Avatar, Select, Divider } from '@chakra-ui/react';
import { FiCheckCircle, FiAlertTriangle, FiMessageSquare, FiTrash2, FiEdit } from 'react-icons/fi';
import useAdminStore from '../../../../shared/stores/useAdminStore';
import useAuditLogStore from '../../../../shared/stores/useAuditLogStore';
import { useAuth } from '../../../../app/providers/AuthProvider';
import { useContextMenu } from '../../../../shared/hooks/useContextMenu';
import ContextMenu from '../../../../shared/components/ContextMenu';
import { useMinDisplayTime } from '../../../../shared/hooks/useMinDisplayTime';
import { ListSkeleton } from '../../../../shared/components/LoadingState';
import { useAppToast } from '../../../../shared/hooks/useAppToast';
import { confirmAction } from '../../../../shared/utils/confirm';

const TYPE_COLORS = { property: 'blue', user: 'purple', payment: 'orange' };
const STATUS_COLORS = { open: 'red', investigating: 'yellow', resolved: 'green' };
const PRIORITY_COLORS = { high: 'red', medium: 'yellow', low: 'green' };

/** Reported Issues — kebab menu replaced with right-click/long-press context menu. */
export function ReportedIssuesList({ onEditReport }) {
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
  const { isOpen, position, activeItem, close, handlers } = useContextMenu();

  const reports = allReports.filter((report) => {
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || report.priority === priorityFilter;
    return matchesType && matchesStatus && matchesPriority;
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

  const getRowActions = (report) => [
    {
      label: 'Contact Reporter',
      icon: FiMessageSquare,
      onClick: () => toast({ title: 'Not available yet', description: "Direct messaging isn't supported in this preview.", status: 'info' }),
    },
    { label: 'Edit Report', icon: FiEdit, onClick: () => onEditReport?.(report) },
    { label: 'Mark as Resolved', icon: FiCheckCircle, onClick: () => handleResolve(report) },
    { label: 'Start Investigation', icon: FiAlertTriangle, onClick: () => handleInvestigate(report) },
    { label: 'Delete Report', icon: FiTrash2, isDestructive: true, onClick: () => handleDelete(report) },
  ];

  return (
    <Box>
      <Flex wrap="wrap" gap={4} mb={6}>
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

      {isLoading ? (
        <ListSkeleton count={4} />
      ) : reports.length === 0 ? (
        <Text textAlign="center" color="gray.600" py={12}>No reports match this filter.</Text>
      ) : (
        <VStack spacing={4} align="stretch">
          {reports.map((report) => (
            <Box
              key={report.id}
              bg="white"
              p={5}
              borderRadius="lg"
              border="1px"
              borderColor="gray.200"
              cursor="context-menu"
              onContextMenu={(e) => handlers.onContextMenu(e, report)}
              onTouchStart={(e) => handlers.onTouchStart(e, report)}
              onTouchMove={handlers.onTouchMove}
              onTouchEnd={handlers.onTouchEnd}
            >
              <HStack justify="space-between" mb={3}>
                <HStack spacing={3}>
                  <Badge colorScheme={TYPE_COLORS[report.type] || 'gray'} borderRadius="md">{report.type}</Badge>
                  <Badge colorScheme={STATUS_COLORS[report.status] || 'gray'} borderRadius="md">{report.status}</Badge>
                  <Badge colorScheme={PRIORITY_COLORS[report.priority] || 'gray'} borderRadius="md">{report.priority} priority</Badge>
                </HStack>
              </HStack>

              <Text fontWeight="bold" fontSize="md" mb={2}>{report.title}</Text>
              <Text fontSize="sm" color="gray.600" mb={3}>{report.description}</Text>

              <Divider my={3} />

              <HStack justify="space-between" fontSize="sm">
                <HStack spacing={2}>
                  <Avatar size="xs" name={report.reporter} />
                  <Text color="gray.600">Reported by <strong>{report.reporter}</strong></Text>
                </HStack>
                <Text color="gray.600">{report.created}</Text>
              </HStack>

              <HStack mt={2} fontSize="sm">
                <Text color="gray.600">Against:</Text>
                <Text fontWeight="medium">{report.reportedItem}</Text>
              </HStack>

              {report.status === 'open' && (
                <HStack mt={4} spacing={2}>
                  <Button size="sm" colorScheme="yellow" leftIcon={<FiAlertTriangle />} onClick={() => handleInvestigate(report)}>Investigate</Button>
                  <Button size="sm" colorScheme="green" leftIcon={<FiCheckCircle />} onClick={() => handleResolve(report)}>Resolve</Button>
                </HStack>
              )}
            </Box>
          ))}
        </VStack>
      )}

      <ContextMenu isOpen={isOpen} position={position} items={activeItem ? getRowActions(activeItem) : []} onClose={close} />
    </Box>
  );
}

export default ReportedIssuesList;
