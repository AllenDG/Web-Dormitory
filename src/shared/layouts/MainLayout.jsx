import { Box } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/**
 * Main Layout for Public Pages
 * Clean architecture with modern navbar and footer
 */
const MainLayout = () => {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Navbar />
      <Box as="main" flex="1">
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default MainLayout;
