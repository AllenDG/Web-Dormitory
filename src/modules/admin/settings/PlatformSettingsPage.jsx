import { Box } from '@chakra-ui/react';
import PageBanner from '../../../shared/components/PageBanner';
import PlatformSettingsForm from './components/PlatformSettingsForm';

const PlatformSettingsPage = () => {
  return (
    <Box>
      <PageBanner title="System Settings" subtitle="Configure system-wide settings and features" />
      <PlatformSettingsForm />
    </Box>
  );
};

export default PlatformSettingsPage;
