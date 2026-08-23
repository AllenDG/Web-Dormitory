import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Icon,
  SimpleGrid,
  Switch,
  Avatar,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Divider,
} from '@chakra-ui/react';
import { FiSave, FiUser, FiBell } from 'react-icons/fi';
import { useState } from 'react';
import { useAuth } from '../../../app/providers/AuthProvider';
import { useAppToast } from '../../../shared/hooks/useAppToast';
import PageBanner from '../../../shared/components/PageBanner';
import Button from '../../../shared/components/Button';
import ImageUploadField from '../../../shared/components/ImageUploadField';

/**
 * Settings — Profile and Notifications only. Security (password change,
 * 2FA) and Billing (subscription, payment method) tabs were removed: every
 * button in them had no onClick or faked a success toast with no backing
 * store/auth capability anywhere in the app -- a subscription tier that
 * was never built elsewhere. Faking those was worse than not having them.
 */

const DEFAULT_NOTIFICATION_PREFS = {
  emailBookings: true,
  emailInquiries: true,
  emailMessages: true,
  smsBookings: false,
  smsInquiries: false,
};

const SettingsPage = () => {
  const toast = useAppToast();
  const { user, updateProfile } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    avatar: user?.avatar || '',
  });

  const [notifications, setNotifications] = useState(
    user?.notificationPreferences || DEFAULT_NOTIFICATION_PREFS
  );

  const handleProfileSave = async () => {
    await updateProfile(profileData);
    toast({ title: 'Profile Updated', description: 'Your profile information has been saved.', status: 'success' });
  };

  const handleNotificationsSave = async () => {
    await updateProfile({ notificationPreferences: notifications });
    toast({ title: 'Preferences Saved', description: 'Your notification preferences have been updated.', status: 'success' });
  };

  return (
    <Box>
      <PageBanner title="Settings" subtitle="Manage your account and notification preferences" />

      <Tabs colorScheme="primary">
        <TabList>
          <Tab><Icon as={FiUser} mr={2} />Profile</Tab>
          <Tab><Icon as={FiBell} mr={2} />Notifications</Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0} pt={6}>
            <Box bg="white" p={8} borderRadius="lg" border="1px" borderColor="gray.200">
              <VStack spacing={6} align="stretch">
                <HStack spacing={6} align="start">
                  <Avatar size="2xl" name={profileData.name} src={profileData.avatar || undefined} bg="primary.500" />
                  <VStack align="start" spacing={2} flex={1}>
                    <Heading size="md">{profileData.name}</Heading>
                    <Text color="gray.600" fontSize="sm">Property Owner</Text>
                    <Box w="full" maxW="200px">
                      <ImageUploadField
                        value={profileData.avatar ? [profileData.avatar] : []}
                        onChange={(images) => setProfileData((prev) => ({ ...prev, avatar: images[images.length - 1] || '' }))}
                      />
                    </Box>
                  </VStack>
                </HStack>

                <Divider />

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <FormControl>
                    <FormLabel>Full Name</FormLabel>
                    <Input value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Email Address</FormLabel>
                    <Input type="email" value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Phone Number</FormLabel>
                    <Input value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Address</FormLabel>
                    <Input value={profileData.address} onChange={(e) => setProfileData({ ...profileData, address: e.target.value })} />
                  </FormControl>
                </SimpleGrid>

                <Button leftIcon={<Icon as={FiSave} />} alignSelf="start" onClick={handleProfileSave}>
                  Save Changes
                </Button>
              </VStack>
            </Box>
          </TabPanel>

          <TabPanel px={0} pt={6}>
            <Box bg="white" p={8} borderRadius="lg" border="1px" borderColor="gray.200">
              <VStack spacing={6} align="stretch">
                <Box>
                  <Heading size="sm" mb={4}>Email Notifications</Heading>
                  <VStack spacing={4} align="stretch">
                    <HStack justify="space-between">
                      <Box>
                        <Text fontWeight="medium">Booking Requests</Text>
                        <Text fontSize="sm" color="gray.600">Get notified when someone requests to visit your property</Text>
                      </Box>
                      <Switch isChecked={notifications.emailBookings} onChange={(e) => setNotifications({ ...notifications, emailBookings: e.target.checked })} colorScheme="primary" />
                    </HStack>

                    <HStack justify="space-between">
                      <Box>
                        <Text fontWeight="medium">New Inquiries</Text>
                        <Text fontSize="sm" color="gray.600">Receive emails when tenants send inquiries</Text>
                      </Box>
                      <Switch isChecked={notifications.emailInquiries} onChange={(e) => setNotifications({ ...notifications, emailInquiries: e.target.checked })} colorScheme="primary" />
                    </HStack>

                    <HStack justify="space-between">
                      <Box>
                        <Text fontWeight="medium">Messages</Text>
                        <Text fontSize="sm" color="gray.600">Get notified about new messages from tenants</Text>
                      </Box>
                      <Switch isChecked={notifications.emailMessages} onChange={(e) => setNotifications({ ...notifications, emailMessages: e.target.checked })} colorScheme="primary" />
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
                        <Text fontSize="sm" color="gray.600">Receive SMS for urgent booking requests</Text>
                      </Box>
                      <Switch isChecked={notifications.smsBookings} onChange={(e) => setNotifications({ ...notifications, smsBookings: e.target.checked })} colorScheme="primary" />
                    </HStack>

                    <HStack justify="space-between">
                      <Box>
                        <Text fontWeight="medium">New Inquiries</Text>
                        <Text fontSize="sm" color="gray.600">Get SMS alerts for new tenant inquiries</Text>
                      </Box>
                      <Switch isChecked={notifications.smsInquiries} onChange={(e) => setNotifications({ ...notifications, smsInquiries: e.target.checked })} colorScheme="primary" />
                    </HStack>
                  </VStack>
                </Box>

                <Button leftIcon={<Icon as={FiSave} />} alignSelf="start" onClick={handleNotificationsSave}>
                  Save Preferences
                </Button>
              </VStack>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default SettingsPage;
