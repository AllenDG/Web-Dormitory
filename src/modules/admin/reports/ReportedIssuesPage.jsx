import { useMemo, useState } from 'react';
import { Box, Icon, SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { FiPlus, FiAlertCircle, FiEye, FiCheckCircle } from 'react-icons/fi';
import PageBanner from '../../../shared/components/PageBanner';
import Button from '../../../shared/components/Button';
import StatCard from '../../../shared/components/StatCard';
import useAdminStore from '../../../shared/stores/useAdminStore';
import ReportedIssuesList from './components/ReportedIssuesList';
import ReportFormPanel from './components/ReportFormPanel';

const ReportedIssuesPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [panel, setPanel] = useState({ mode: 'add', report: null });

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
        actions={
          <Button leftIcon={<Icon as={FiPlus} />} onClick={handleAddReport}>
            Log Report
          </Button>
        }
      />

      <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={6} mb={8}>
        <StatCard label="Open" value={statusCounts.open} icon={FiAlertCircle} color="error" />
        <StatCard label="Investigating" value={statusCounts.investigating} icon={FiEye} color="warning" />
        <StatCard label="Resolved" value={statusCounts.resolved} icon={FiCheckCircle} color="success" />
      </SimpleGrid>

      <ReportedIssuesList onEditReport={handleEditReport} />
      <ReportFormPanel isOpen={isOpen} mode={panel.mode} report={panel.report} onClose={onClose} />
    </Box>
  );
};

export default ReportedIssuesPage;
