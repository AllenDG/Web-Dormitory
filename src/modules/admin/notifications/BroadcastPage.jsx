import { Box } from '@chakra-ui/react';
import PageBanner from '../../../shared/components/PageBanner';
import BroadcastForm from './components/BroadcastForm';
import BroadcastHistoryList from './components/BroadcastHistoryList';

const BroadcastPage = () => (
  <Box>
    <PageBanner title="Announcements" subtitle="Notify Owners and Tenants about system errors, maintenance, and enhancements" />
    <BroadcastForm />
    <BroadcastHistoryList />
  </Box>
);

export default BroadcastPage;
