import { Box } from '@chakra-ui/react';
import PageBanner from '../../../shared/components/PageBanner';
import ReportedIssuesList from './components/ReportedIssuesList';

const STATUS_TITLES = { all: 'All Reports', open: 'Open', investigating: 'Investigating', resolved: 'Resolved' };

const ReportedIssuesPage = ({ status = 'all' }) => (
  <Box>
    <PageBanner title={STATUS_TITLES[status]} subtitle="Triage complaints and platform reports" />
    <ReportedIssuesList status={status} />
  </Box>
);

export default ReportedIssuesPage;
