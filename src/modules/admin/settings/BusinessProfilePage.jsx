import { Box } from '@chakra-ui/react';
import PageBanner from '../../../shared/components/PageBanner';
import BusinessProfileForm from './components/BusinessProfileForm';

const BusinessProfilePage = () => {
  return (
    <Box>
      <PageBanner title="Business Profile" subtitle="The business identity that owns and runs the platform" />
      <BusinessProfileForm />
    </Box>
  );
};

export default BusinessProfilePage;
