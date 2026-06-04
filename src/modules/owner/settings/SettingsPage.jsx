import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Icon,
  SimpleGrid,
  Switch,
  Avatar,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
  Divider,
} from '@chakra-ui/react';
import { FiSave, FiUser, FiBell, FiLock, FiCreditCard } from 'react-icons/fi';
import { useState } from 'react';
import { useAuth } from '../../../app/providers/AuthProvider';

/**
 * Settings Page
 * Owner can manage profile, notifications, security, and payment settings
 */

const SettingsPage = () => {
  const toast = useToast();
  const { user } = useAuth();
  
  // Profile Settings
  const [profileData, setProfileData] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john@example.com',
    phone: '+63 912 345 6789',
    address: '123 Main St, Dagupan City',
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailBookings: true,
    emailInquiries: true,
    emailMessages: true,
    smsBookings: false,
    smsInquiries: false,
  });

  const handleProfileSave = () => {
    toast({
      title: 'Profile Updated',
      description: 'Your profile information has been saved.',
      status: 'success',
      duration: 3000,
    });
  };

  const handleNotificationsSave = () => {
    toast({
      title: 'Preferences Saved',
      description: 'Your notification preferences have been updated.',
      status: 'success',
      duration: 3000,
    });
  };

  const handlePasswordChange = () => {
    toast({
      title: 'Password Changed',
      description: 'Your password has been updated successfully.',
      status: 'success',
      duration: 3000,
    });
  };

  return (
    <Box>
      {/* Page Header */}
      <VStack align="start" spacing={2} mb={8}>
        <Heading size="lg">Settings</Heading>
        <Text color="gray.600">
          Manage your account preferences and settings
        </Text>
      </VStack>

      {/* Tabs */}
      <Tabs colorScheme="primary">
        <TabList>
          <Tab>
            <Icon as={FiUser} mr={2} />
            Profile
          </Tab>
          <Tab>
            <Icon as={FiBell} mr={2} />
            Notifications
          </Tab>
          <Tab>
            <Icon as={FiLock} mr={2} />
            Security
          </Tab>
          <Tab>
            <Icon as={FiCreditCard} mr={2} />
            Billing
          </Tab>
        </TabList>

        <TabPanels>
          {/* Profile Tab */}
          <TabPanel px={0} pt={6}>
            <Box bg="white" p={8} borderRadius="lg" border="1px" borderColor="gray.200">
              <VStack spacing={6} align="stretch">
                {/* Avatar */}
                <HStack spacing={6}>
                  <Avatar size="2xl" name={profileData.name} bg="primary.500" />
                  <VStack align="start" spacing={2}>
                    <Heading size="md">{profileData.name}</Heading>
                    <Text color="gray.600" fontSize="sm">Property Owner</Text>
                    <Button size="sm" variant="outline">Change Photo</Button>
                  </VStack>
                </HStack>

                <Divider />

                {/* Profile Form */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <FormControl>
                    <FormLabel>Full Name</FormLabel>
                    <Input
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Email Address</FormLabel>
                    <Input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Phone Number</FormLabel>
                    <Input
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Address</FormLabel>
                    <Input
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    />
                  </FormControl>
                </SimpleGrid>

                <Button
                  leftIcon={<Icon as={FiSave} />}
                  colorScheme="primary"
                  alignSelf="start"
                  onClick={handleProfileSave}
                >
                  Save Changes
                </Button>
              </VStack>
            </Box>
          </TabPanel>

          {/* Notifications Tab */}
          <TabPanel px={0} pt={6}>
            <Box bg="white" p={8} borderRadius="lg" border="1px" borderColor="gray.200">
              <VStack spacing={6} align="stretch">
                <Box>
                  <Heading size="sm" mb={4}>Email Notifications</Heading>
                  <VStack spacing={4} align="stretch">
                    <HStack justify="space-between">
                      <Box>
                        <Text fontWeight="medium">Booking Requests</Text>
                        <Text fontSize="sm" color="gray.600">
                          Get notified when someone requests to visit your property
                        </Text>
                      </Box>
                      <Switch
                        isChecked={notifications.emailBookings}
                        onChange={(e) => setNotifications({ ...notifications, emailBookings: e.target.checked })}
                        colorScheme="primary"
                      />
                    </HStack>

                    <HStack justify="space-between">
                      <Box>
                        <Text fontWeight="medium">New Inquiries</Text>
                        <Text fontSize="sm" color="gray.600">
                          Receive emails when tenants send inquiries
                        </Text>
                      </Box>
                      <Switch
                        isChecked={notifications.emailInquiries}
                        onChange={(e) => setNotifications({ ...notifications, emailInquiries: e.target.checked })}
                        colorScheme="primary"
                      />
                    </HStack>

                    <HStack justify="space-between">
                      <Box>
                        <Text fontWeight="medium">Messages</Text>
                        <Text fontSize="sm" color="gray.600">
                          Get notified about new messages from tenants
                        </Text>
                      </Box>
                      <Switch
                        isChecked={notifications.emailMessages}
                        onChange={(e) => setNotifications({ ...notifications, emailMessages: e.target.checked })}
                        colorScheme="primary"
                      />
                    </HStack>
                  </VStack>
                </Box>

                <Divider />

                <Box>
                  <Heading size="sm" mb={4}>SMS Notifications</Heading>
                  <VStack spacing={4} align="stretch">
                    <HStack justify="space-between">
                      <Box>
                        <Text fontWeight="medium">Booking Requests</Text>
                        <Text fontSize="sm" color="gray.600">
                          Receive SMS for urgent booking requests
                        </Text>
                      </Box>
                      <Switch
                        isChecked={notifications.smsBookings}
                        onChange={(e) => setNotifications({ ...notifications, smsBookings: e.target.checked })}
                        colorScheme="primary"
                      />
                    </HStack>

                    <HStack justify="space-between">
                      <Box>
                        <Text fontWeight="medium">New Inquiries</Text>
                        <Text fontSize="sm" color="gray.600">
                          Get SMS alerts for new tenant inquiries
                        </Text>
                      </Box>
                      <Switch
                        isChecked={notifications.smsInquiries}
                        onChange={(e) => setNotifications({ ...notifications, smsInquiries: e.target.checked })}
                        colorScheme="primary"
                      />
                    </HStack>
                  </VStack>
                </Box>

                <Button
                  leftIcon={<Icon as={FiSave} />}
                  colorScheme="primary"
                  alignSelf="start"
                  onClick={handleNotificationsSave}
                >
                  Save Preferences
                </Button>
              </VStack>
            </Box>
          </TabPanel>

          {/* Security Tab */}
          <TabPanel px={0} pt={6}>
            <Box bg="white" p={8} borderRadius="lg" border="1px" borderColor="gray.200">
              <VStack spacing={6} align="stretch">
                <Box>
                  <Heading size="sm" mb={4}>Change Password</Heading>
                  <VStack spacing={4} align="stretch">
                    <FormControl>
                      <FormLabel>Current Password</FormLabel>
                      <Input type="password" placeholder="Enter current password" />
                    </FormControl>

                    <FormControl>
                      <FormLabel>New Password</FormLabel>
                      <Input type="password" placeholder="Enter new password" />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Confirm New Password</FormLabel>
                      <Input type="password" placeholder="Confirm new password" />
                    </FormControl>

                    <Button
                      colorScheme="primary"
                      alignSelf="start"
                      onClick={handlePasswordChange}
                    >
                      Update Password
                    </Button>
                  </VStack>
                </Box>

                <Divider />

                <Box>
                  <Heading size="sm" mb={4}>Two-Factor Authentication</Heading>
                  <HStack justify="space-between">
                    <Box>
                      <Text fontWeight="medium">Enable 2FA</Text>
                      <Text fontSize="sm" color="gray.600">
                        Add an extra layer of security to your account
                      </Text>
                    </Box>
                    <Button size="sm" variant="outline">
                      Enable
                    </Button>
                  </HStack>
                </Box>
              </VStack>
            </Box>
          </TabPanel>

          {/* Billing Tab */}
          <TabPanel px={0} pt={6}>
            <Box bg="white" p={8} borderRadius="lg" border="1px" borderColor="gray.200">
              <VStack spacing={6} align="stretch">
                <Box>
                  <Heading size="sm" mb={4}>Subscription Plan</Heading>
                  <Box bg="primary.50" p={6} borderRadius="lg" border="1px" borderColor="primary.200">
                    <HStack justify="space-between" mb={4}>
                      <VStack align="start" spacing={1}>
                        <Text fontSize="lg" fontWeight="bold">Free Plan</Text>
                        <Text fontSize="sm" color="gray.600">Up to 5 property listings</Text>
                      </VStack>
                      <Text fontSize="2xl" fontWeight="bold" color="primary.600">₱0/mo</Text>
                    </HStack>
                    <Button colorScheme="primary" size="sm">
                      Upgrade to Pro
                    </Button>
                  </Box>
                </Box>

                <Divider />

                <Box>
                  <Heading size="sm" mb={4}>Payment Method</Heading>
                  <Text fontSize="sm" color="gray.600" mb={4}>
                    No payment method on file
                  </Text>
                  <Button size="sm" variant="outline">
                    Add Payment Method
                  </Button>
                </Box>

                <Divider />

                <Box>
                  <Heading size="sm" mb={4}>Billing History</Heading>
                  <Text fontSize="sm" color="gray.600">
                    No billing history available
                  </Text>
                </Box>
              </VStack>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default SettingsPage;
