import { Box } from '@chakra-ui/react';
import PageBanner from '../../../shared/components/PageBanner';
import PropertyModerationGrid from './components/PropertyModerationGrid';

const STATUS_TITLES = { all: 'All Listings', pending: 'Pending', approved: 'Approved', rejected: 'Rejected' };

const PropertyModerationPage = ({ status = 'all' }) => (
  <Box>
    <PageBanner title={STATUS_TITLES[status]} subtitle="Review and approve new property listings" />
    <PropertyModerationGrid status={status} />
  </Box>
);

export default PropertyModerationPage;
