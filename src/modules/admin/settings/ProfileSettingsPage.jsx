import { Box } from '@chakra-ui/react';
import PageBanner from '../../../shared/components/PageBanner';
import ProfileSettingsForm from './components/ProfileSettingsForm';

const ProfileSettingsPage = () => {
  return (
    <Box>
      <PageBanner title="My Profile" subtitle="Manage your admin account details" />
      <ProfileSettingsForm />
    </Box>
  );
};

export default ProfileSettingsPage;
