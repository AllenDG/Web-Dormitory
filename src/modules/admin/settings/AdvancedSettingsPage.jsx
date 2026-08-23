import { Box } from '@chakra-ui/react';
import PageBanner from '../../../shared/components/PageBanner';
import AdvancedSettingsForm from './components/AdvancedSettingsForm';

const AdvancedSettingsPage = () => {
  return (
    <Box>
      <PageBanner title="Advanced Settings" subtitle="Maintenance mode, upload limits, and session policy" />
      <AdvancedSettingsForm />
    </Box>
  );
};

export default AdvancedSettingsPage;
