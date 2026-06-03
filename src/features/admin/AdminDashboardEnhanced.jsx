import { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/providers/AuthProvider';
import { PlatformStats } from './components/PlatformStats';
import { UserManagement } from './components/UserManagement';
import { UserDetailsModal } from './components/UserDetailsModal';
import { PropertyModeration } from './components/PropertyModeration';
import { ReportedIssues } from './components/ReportedIssues';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { SystemSettings } from './components/SystemSettings';

/**
 * AdminDashboardEnhanced Component
 * Enhanced admin dashboard with comprehensive management tools
 */
export function AdminDashboardEnhanced() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  // Redirect if not admin
  if (!isAdmin()) {
    navigate('/');
    return null;
  }

  const handleViewUserDetails = (user) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleCloseUserModal = () => {
    setIsUserModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <Box bg="gray.50" minH="100vh" py={8}>
      <Container maxW="1400px">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box>
            <Heading size="lg" mb={2}>
              Admin Dashboard
            </Heading>
            <Text color="gray.600">
              Welcome back, {user?.name} - Comprehensive platform management
            </Text>
          </Box>

          {/* Platform Stats */}
          <PlatformStats />

          {/* Management Tabs */}
          <Tabs variant="enclosed" colorScheme="blue">
            <TabList>
              <Tab>Analytics</Tab>
              <Tab>User Management</Tab>
              <Tab>Property Moderation</Tab>
              <Tab>Reported Issues</Tab>
              <Tab>System Settings</Tab>
            </TabList>

            <TabPanels>
              {/* Analytics Tab */}
              <TabPanel px={0} pt={6}>
                <AnalyticsCharts />
              </TabPanel>

              {/* User Management Tab */}
              <TabPanel px={0} pt={6}>
                <UserManagement onViewDetails={handleViewUserDetails} />
              </TabPanel>

              {/* Property Moderation Tab */}
              <TabPanel px={0} pt={6}>
                <PropertyModeration />
              </TabPanel>

              {/* Reported Issues Tab */}
              <TabPanel px={0} pt={6}>
                <ReportedIssues />
              </TabPanel>

              {/* System Settings Tab */}
              <TabPanel px={0} pt={6}>
                <SystemSettings />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>

        {/* User Details Modal */}
        <UserDetailsModal
          isOpen={isUserModalOpen}
          onClose={handleCloseUserModal}
          user={selectedUser}
        />
      </Container>
    </Box>
  );
}

export default AdminDashboardEnhanced;
