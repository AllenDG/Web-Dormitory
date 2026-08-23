import { useState } from 'react';
import { Box, Icon, useDisclosure } from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import PageBanner from '../../../shared/components/PageBanner';
import Button from '../../../shared/components/Button';
import ReportedIssuesList from './components/ReportedIssuesList';
import ReportFormPanel from './components/ReportFormPanel';

const STATUS_TITLES = { all: 'All Reports', open: 'Open', investigating: 'Investigating', resolved: 'Resolved' };
const TYPE_TITLES = { property: 'Property Reports', user: 'User Reports', payment: 'Payment Reports' };

const ReportedIssuesPage = ({ status = 'all', type = 'all' }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [panel, setPanel] = useState({ mode: 'add', report: null });

  const title = type !== 'all' ? TYPE_TITLES[type] : STATUS_TITLES[status];

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
        title={title}
        subtitle="Triage complaints and platform reports"
        actions={
          <Button leftIcon={<Icon as={FiPlus} />} onClick={handleAddReport}>
            Log Report
          </Button>
        }
      />
      <ReportedIssuesList status={status} type={type} onEditReport={handleEditReport} />
      <ReportFormPanel isOpen={isOpen} mode={panel.mode} report={panel.report} onClose={onClose} />
    </Box>
  );
};

export default ReportedIssuesPage;
