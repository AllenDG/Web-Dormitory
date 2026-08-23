import { Box } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AnnouncementBannerHost from '../../domains/notifications/components/AnnouncementBannerHost';

/**
 * Tenant Layout
 * Main layout for tenant-facing pages
 * Includes navbar and footer
 */
const TenantLayout = () => {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Navbar />
      <AnnouncementBannerHost />
      <Box as="main" flex="1">
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default TenantLayout;
