import { useMemo, useState } from 'react';
import { Box, SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { FiAlertCircle, FiEye, FiCheckCircle } from 'react-icons/fi';
import PageBanner from '../../../shared/components/PageBanner';
import StatCard from '../../../shared/components/StatCard';
import useAdminStore from '../../../shared/stores/useAdminStore';
import ReportedIssuesList from './components/ReportedIssuesList';
import ReportFormPanel from './components/ReportFormPanel';
import ReportDetailPanel from './components/ReportDetailPanel';

const ReportedIssuesPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure();
  const [panel, setPanel] = useState({ mode: 'add', report: null });
  const [selectedReport, setSelectedReport] = useState(null);

  const reports = useAdminStore((state) => state.reports);
  const statusCounts = useMemo(
    () =>
      reports.reduce(
        (acc, r) => {
          acc[r.status] = (acc[r.status] || 0) + 1;
          return acc;
        },
        { open: 0, investigating: 0, resolved: 0 }
      ),
    [reports]
  );

  const handleViewDetails = (report) => {
    setSelectedReport(report);
    onDetailOpen();
  };

  const handleEditReport = (report) => {
    setPanel({ mode: 'edit', report });
    onOpen();
  };

  const handleAddReport = () => {
    setPanel({ mode: 'add', report: null });
    onOpen();
  };

  return (
    <Box>
      <PageBanner
        title="Reported Issues"
        subtitle="Triage complaints and platform reports"
      />

      <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={6} mb={8}>
        <StatCard label="Open" value={statusCounts.open} icon={FiAlertCircle} color="error" />
        <StatCard label="Investigating" value={statusCounts.investigating} icon={FiEye} color="warning" />
        <StatCard label="Resolved" value={statusCounts.resolved} icon={FiCheckCircle} color="success" />
      </SimpleGrid>

      <ReportedIssuesList
        onViewDetails={handleViewDetails}
        onEditReport={handleEditReport}
        addLabel="Log Report"
        onAdd={handleAddReport}
      />
      <ReportFormPanel isOpen={isOpen} mode={panel.mode} report={panel.report} onClose={onClose} />
      <ReportDetailPanel isOpen={isDetailOpen} onClose={onDetailClose} report={selectedReport} />
    </Box>
  );
};

export default ReportedIssuesPage;
