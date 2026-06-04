import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Avatar,
  Button,
  useToast,
  Icon,
  Divider,
  SimpleGrid,
  Switch,
  Select,
  Badge,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiUser, FiSettings, FiBell, FiLock, FiHeart, FiCalendar, FiHome } from 'react-icons/fi';
import { useAuth } from '../../../app/providers/AuthProvider';
import { useNavigate } from 'react-router-dom';

/**
 * Tenant Profile Page
 * 
 * Comprehensive profile management for tenants
 * Tabs: Profile, Preferences, Notifications, Security
 * 
 * @component
 */
const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // Profile Data
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    address: user?.address || '',
    occupation: user?.occupation || '',
  });

  // Preferences Data
  const [preferences, setPreferences] = useState({
    propertyType: user?.preferences?.propertyType || 'any',
    minBudget: user?.preferences?.budget?.[0] || 2000,
    maxBudget: user?.preferences?.budget?.[1] || 10000,
    location: user?.preferences?.location || '',
    roomType: user?.preferences?.roomType || 'any',
    stayDuration: user?.preferences?.stayDuration || 'any',
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNotifications: user?.notifications?.email ?? true,
    smsNotifications: user?.notifications?.sms ?? false,
    newListings: user?.notifications?.newListings ?? true,
    priceDrops: user?.notifications?.priceDrops ?? true,
    visitReminders: user?.notifications?.visitReminders ?? true,
    bookingUpdates: user?.notifications?.bookingUpdates ?? true,
    chatMessages: user?.notifications?.chatMessages ?? true,
  });

  // Security Data
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Handle Profile Save
  const handleProfileSave = async () => {
    const result = await updateProfile(profileData);
    
    if (result.success) {
      toast({
        title: 'Profile Updated',
        description: 'Your profile information has been saved successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Update Failed',
        description: result.error || 'Unable to update profile',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Handle Preferences Save
  const handlePreferencesSave = async () => {
    const result = await updateProfile({
      preferences: {
        propertyType: preferences.propertyType,
        budget: [preferences.minBudget, preferences.maxBudget],
        location: preferences.location,
        roomType: preferences.roomType,
        stayDuration: preferences.stayDuration,
      },
    });

    if (result.success) {
      toast({
        title: 'Preferences Updated',
        description: 'Your property preferences have been saved.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Handle Notifications Save
  const handleNotificationsSave = async () => {
    const result = await updateProfile({ notifications });

    if (result.success) {
      toast({
        title: 'Notifications Updated',
        description: 'Your notification preferences have been saved.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Handle Password Change
  const handlePasswordChange = () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'New password and confirmation do not match.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (securityData.newPassword.length < 6) {
      toast({
        title: 'Password Too Short',
        description: 'Password must be at least 6 characters.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Mock password change
    toast({
      title: 'Password Changed',
      description: 'Your password has been updated successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    setSecurityData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  return (
    <Box bg="gray.50" minH="calc(100vh - 64px)" py={8}>
      <Container maxW="1200px">
        {/* Header */}
        <VStack spacing={6} align="stretch" mb={8}>
          <HStack justify="space-between">
            <VStack align="start" spacing={1}>
              <Heading size="lg" color="gray.900">
                My Profile
              </Heading>
              <Text color="gray.600" fontSize="sm">
                Manage your account settings and preferences
              </Text>
            </VStack>
            <Button
              leftIcon={<Icon as={FiHome} />}
              variant="outline"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </HStack>

          {/* Profile Summary Card */}
          <Card>
            <CardBody>
              <HStack spacing={6}>
                <Avatar size="xl" name={user?.name} bg="primary.500" />
                <VStack align="start" spacing={1}>
                  <Heading size="md">{user?.name}</Heading>
                  <Text color="gray.600" fontSize="sm">
                    {user?.email}
                  </Text>
                  <Badge colorScheme="green" borderRadius="full" px={3}>
                    Tenant
                  </Badge>
                </VStack>
              </HStack>
            </CardBody>
          </Card>
        </VStack>

        {/* Tabs */}
        <Card>
          <CardBody p={0}>
            <Tabs colorScheme="primary" isLazy>
              <TabList px={6} pt={6}>
                <Tab>
                  <Icon as={FiUser} mr={2} />
                  Profile
                </Tab>
                <Tab>
                  <Icon as={FiSettings} mr={2} />
                  Preferences
                </Tab>
                <Tab>
                  <Icon as={FiBell} mr={2} />
                  Notifications
                </Tab>
                <Tab>
                  <Icon as={FiLock} mr={2} />
                  Security
                </Tab>
              </TabList>

              <TabPanels>
                {/* Profile Tab */}
                <TabPanel px={6} pt={6} pb={8}>
                  <VStack spacing={6} align="stretch">
                    <Box>
                      <Heading size="sm" mb={4}>
                        Personal Information
                      </Heading>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="500">
                            Full Name
                          </FormLabel>
                          <Input
                            value={profileData.name}
                            onChange={(e) =>
                              setProfileData({ ...profileData, name: e.target.value })
                            }
                            placeholder="Juan Dela Cruz"
                            borderRadius="8px"
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="500">
                            Email Address
                          </FormLabel>
                          <Input
                            type="email"
                            value={profileData.email}
                            onChange={(e) =>
                              setProfileData({ ...profileData, email: e.target.value })
                            }
                            placeholder="your@email.com"
                            borderRadius="8px"
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="500">
                            Phone Number
                          </FormLabel>
                          <Input
                            value={profileData.phone}
                            onChange={(e) =>
                              setProfileData({ ...profileData, phone: e.target.value })
                            }
                            placeholder="+63 912 345 6789"
                            borderRadius="8px"
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="500">
                            Occupation
                          </FormLabel>
                          <Input
                            value={profileData.occupation}
                            onChange={(e) =>
                              setProfileData({ ...profileData, occupation: e.target.value })
                            }
                            placeholder="Student, Professional, etc."
                            borderRadius="8px"
                          />
                        </FormControl>
                      </SimpleGrid>

                      <FormControl mt={6}>
                        <FormLabel fontSize="sm" fontWeight="500">
                          Address
                        </FormLabel>
                        <Input
                          value={profileData.address}
                          onChange={(e) =>
                            setProfileData({ ...profileData, address: e.target.value })
                          }
                          placeholder="Your current address"
                          borderRadius="8px"
                        />
                      </FormControl>

                      <FormControl mt={6}>
                        <FormLabel fontSize="sm" fontWeight="500">
                          Bio
                        </FormLabel>
                        <Textarea
                          value={profileData.bio}
                          onChange={(e) =>
                            setProfileData({ ...profileData, bio: e.target.value })
                          }
                          placeholder="Tell us about yourself..."
                          rows={4}
                          borderRadius="8px"
                        />
                      </FormControl>
                    </Box>

                    <Divider />

                    <HStack justify="flex-end">
                      <Button
                        colorScheme="primary"
                        onClick={handleProfileSave}
                        borderRadius="8px"
                      >
                        Save Changes
                      </Button>
                    </HStack>
                  </VStack>
                </TabPanel>

                {/* Preferences Tab */}
                <TabPanel px={6} pt={6} pb={8}>
                  <VStack spacing={6} align="stretch">
                    <Box>
                      <Heading size="sm" mb={4}>
                        Property Preferences
                      </Heading>
                      <Text fontSize="sm" color="gray.600" mb={6}>
                        Help us recommend properties that match your needs
                      </Text>

                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="500">
                            Property Type
                          </FormLabel>
                          <Select
                            value={preferences.propertyType}
                            onChange={(e) =>
                              setPreferences({ ...preferences, propertyType: e.target.value })
                            }
                            borderRadius="8px"
                          >
                            <option value="any">Any Type</option>
                            <option value="dormitory">Dormitory</option>
                            <option value="apartment">Apartment</option>
                            <option value="studio">Studio</option>
                            <option value="condo">Condominium</option>
                            <option value="house">House</option>
                          </Select>
                        </FormControl>

                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="500">
                            Room Type
                          </FormLabel>
                          <Select
                            value={preferences.roomType}
                            onChange={(e) =>
                              setPreferences({ ...preferences, roomType: e.target.value })
                            }
                            borderRadius="8px"
                          >
                            <option value="any">Any Room</option>
                            <option value="single">Single Room</option>
                            <option value="double">Double Room</option>
                            <option value="shared">Shared Room</option>
                            <option value="studio">Studio Unit</option>
                          </Select>
                        </FormControl>

                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="500">
                            Minimum Budget (₱/month)
                          </FormLabel>
                          <Input
                            type="number"
                            value={preferences.minBudget}
                            onChange={(e) =>
                              setPreferences({ ...preferences, minBudget: parseInt(e.target.value) })
                            }
                            borderRadius="8px"
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="500">
                            Maximum Budget (₱/month)
                          </FormLabel>
                          <Input
                            type="number"
                            value={preferences.maxBudget}
                            onChange={(e) =>
                              setPreferences({ ...preferences, maxBudget: parseInt(e.target.value) })
                            }
                            borderRadius="8px"
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="500">
                            Preferred Location
                          </FormLabel>
                          <Input
                            value={preferences.location}
                            onChange={(e) =>
                              setPreferences({ ...preferences, location: e.target.value })
                            }
                            placeholder="e.g., Dagupan, Manila"
                            borderRadius="8px"
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="500">
                            Stay Duration
                          </FormLabel>
                          <Select
                            value={preferences.stayDuration}
                            onChange={(e) =>
                              setPreferences({ ...preferences, stayDuration: e.target.value })
                            }
                            borderRadius="8px"
                          >
                            <option value="any">Any Duration</option>
                            <option value="daily">Daily</option>
                            <option value="6months">6 Months</option>
                            <option value="1year">1 Year</option>
                          </Select>
                        </FormControl>
                      </SimpleGrid>
                    </Box>

                    <Divider />

                    <HStack justify="flex-end">
                      <Button
                        colorScheme="primary"
                        onClick={handlePreferencesSave}
                        borderRadius="8px"
                      >
                        Save Preferences
                      </Button>
                    </HStack>
                  </VStack>
                </TabPanel>

                {/* Notifications Tab */}
                <TabPanel px={6} pt={6} pb={8}>
                  <VStack spacing={6} align="stretch">
                    <Box>
                      <Heading size="sm" mb={4}>
                        Notification Preferences
                      </Heading>
                      <Text fontSize="sm" color="gray.600" mb={6}>
                        Choose how you want to receive updates
                      </Text>

                      <VStack spacing={4} align="stretch">
                        <HStack justify="space-between" p={4} bg="gray.50" borderRadius="8px">
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="500">Email Notifications</Text>
                            <Text fontSize="sm" color="gray.600">
                              Receive updates via email
                            </Text>
                          </VStack>
                          <Switch
                            colorScheme="primary"
                            isChecked={notifications.emailNotifications}
                            onChange={(e) =>
                              setNotifications({
                                ...notifications,
                                emailNotifications: e.target.checked,
                              })
                            }
                          />
                        </HStack>

                        <HStack justify="space-between" p={4} bg="gray.50" borderRadius="8px">
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="500">SMS Notifications</Text>
                            <Text fontSize="sm" color="gray.600">
                              Receive updates via SMS
                            </Text>
                          </VStack>
                          <Switch
                            colorScheme="primary"
                            isChecked={notifications.smsNotifications}
                            onChange={(e) =>
                              setNotifications({
                                ...notifications,
                                smsNotifications: e.target.checked,
                              })
                            }
                          />
                        </HStack>

                        <Divider />

                        <Heading size="xs" color="gray.700">
                          Notification Types
                        </Heading>

                        <HStack justify="space-between" p={4} bg="gray.50" borderRadius="8px">
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="500">New Listings</Text>
                            <Text fontSize="sm" color="gray.600">
                              Properties matching your preferences
                            </Text>
                          </VStack>
                          <Switch
                            colorScheme="primary"
                            isChecked={notifications.newListings}
                            onChange={(e) =>
                              setNotifications({
                                ...notifications,
                                newListings: e.target.checked,
                              })
                            }
                          />
                        </HStack>

                        <HStack justify="space-between" p={4} bg="gray.50" borderRadius="8px">
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="500">Price Drops</Text>
                            <Text fontSize="sm" color="gray.600">
                              When favorited properties reduce price
                            </Text>
                          </VStack>
                          <Switch
                            colorScheme="primary"
                            isChecked={notifications.priceDrops}
                            onChange={(e) =>
                              setNotifications({
                                ...notifications,
                                priceDrops: e.target.checked,
                              })
                            }
                          />
                        </HStack>

                        <HStack justify="space-between" p={4} bg="gray.50" borderRadius="8px">
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="500">Visit Reminders</Text>
                            <Text fontSize="sm" color="gray.600">
                              Reminders for scheduled visits
                            </Text>
                          </VStack>
                          <Switch
                            colorScheme="primary"
                            isChecked={notifications.visitReminders}
                            onChange={(e) =>
                              setNotifications({
                                ...notifications,
                                visitReminders: e.target.checked,
                              })
                            }
                          />
                        </HStack>

                        <HStack justify="space-between" p={4} bg="gray.50" borderRadius="8px">
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="500">Booking Updates</Text>
                            <Text fontSize="sm" color="gray.600">
                              Status changes on your bookings
                            </Text>
                          </VStack>
                          <Switch
                            colorScheme="primary"
                            isChecked={notifications.bookingUpdates}
                            onChange={(e) =>
                              setNotifications({
                                ...notifications,
                                bookingUpdates: e.target.checked,
                              })
                            }
                          />
                        </HStack>

                        <HStack justify="space-between" p={4} bg="gray.50" borderRadius="8px">
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="500">Chat Messages</Text>
                            <Text fontSize="sm" color="gray.600">
                              New messages from property owners
                            </Text>
                          </VStack>
                          <Switch
                            colorScheme="primary"
                            isChecked={notifications.chatMessages}
                            onChange={(e) =>
                              setNotifications({
                                ...notifications,
                                chatMessages: e.target.checked,
                              })
                            }
                          />
                        </HStack>
                      </VStack>
                    </Box>

                    <Divider />

                    <HStack justify="flex-end">
                      <Button
                        colorScheme="primary"
                        onClick={handleNotificationsSave}
                        borderRadius="8px"
                      >
                        Save Preferences
                      </Button>
                    </HStack>
                  </VStack>
                </TabPanel>

                {/* Security Tab */}
                <TabPanel px={6} pt={6} pb={8}>
                  <VStack spacing={6} align="stretch">
                    <Box>
                      <Heading size="sm" mb={4}>
                        Change Password
                      </Heading>
                      <Text fontSize="sm" color="gray.600" mb={6}>
                        Update your password to keep your account secure
                      </Text>

                      <VStack spacing={4} align="stretch" maxW="500px">
                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="500">
                            Current Password
                          </FormLabel>
                          <Input
                            type="password"
                            value={securityData.currentPassword}
                            onChange={(e) =>
                              setSecurityData({
                                ...securityData,
                                currentPassword: e.target.value,
                              })
                            }
                            placeholder="Enter current password"
                            borderRadius="8px"
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="500">
                            New Password
                          </FormLabel>
                          <Input
                            type="password"
                            value={securityData.newPassword}
                            onChange={(e) =>
                              setSecurityData({
                                ...securityData,
                                newPassword: e.target.value,
                              })
                            }
                            placeholder="Enter new password"
                            borderRadius="8px"
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="500">
                            Confirm New Password
                          </FormLabel>
                          <Input
                            type="password"
                            value={securityData.confirmPassword}
                            onChange={(e) =>
                              setSecurityData({
                                ...securityData,
                                confirmPassword: e.target.value,
                              })
                            }
                            placeholder="Confirm new password"
                            borderRadius="8px"
                          />
                        </FormControl>

                        <Button
                          colorScheme="primary"
                          onClick={handlePasswordChange}
                          borderRadius="8px"
                          alignSelf="start"
                        >
                          Update Password
                        </Button>
                      </VStack>
                    </Box>

                    <Divider />

                    <Box>
                      <Heading size="sm" mb={4} color="red.600">
                        Danger Zone
                      </Heading>
                      <Card borderColor="red.200" borderWidth="1px">
                        <CardBody>
                          <VStack align="start" spacing={3}>
                            <Text fontWeight="500">Delete Account</Text>
                            <Text fontSize="sm" color="gray.600">
                              Once you delete your account, there is no going back. Please be
                              certain.
                            </Text>
                            <Button
                              colorScheme="red"
                              variant="outline"
                              size="sm"
                              borderRadius="8px"
                            >
                              Delete My Account
                            </Button>
                          </VStack>
                        </CardBody>
                      </Card>
                    </Box>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>

        {/* Quick Links */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mt={6}>
          <Card
            cursor="pointer"
            onClick={() => navigate('/favorites')}
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
            transition="all 0.2s"
          >
            <CardBody>
              <HStack>
                <Icon as={FiHeart} boxSize={5} color="primary.500" />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="500">My Favorites</Text>
                  <Text fontSize="sm" color="gray.600">
                    View saved properties
                  </Text>
                </VStack>
              </HStack>
            </CardBody>
          </Card>

          <Card
            cursor="pointer"
            onClick={() => navigate('/my-bookings')}
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
            transition="all 0.2s"
          >
            <CardBody>
              <HStack>
                <Icon as={FiCalendar} boxSize={5} color="primary.500" />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="500">My Bookings</Text>
                  <Text fontSize="sm" color="gray.600">
                    View booking history
                  </Text>
                </VStack>
              </HStack>
            </CardBody>
          </Card>

          <Card
            cursor="pointer"
            onClick={() => navigate('/find-rentals')}
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
            transition="all 0.2s"
          >
            <CardBody>
              <HStack>
                <Icon as={FiHome} boxSize={5} color="primary.500" />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="500">Find Rentals</Text>
                  <Text fontSize="sm" color="gray.600">
                    Browse properties
                  </Text>
                </VStack>
              </HStack>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default ProfilePage;
