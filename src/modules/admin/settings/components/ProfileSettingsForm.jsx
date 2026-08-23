import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Avatar,
  Button,
  Icon,
  Divider,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { FiSave } from 'react-icons/fi';
import { useAuth } from '../../../../app/providers/AuthProvider';
import { useAppToast } from '../../../../shared/hooks/useAppToast';

const ProfileSettingsForm = () => {
  const toast = useAppToast();
  const { user, updateProfile } = useAuth();
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleProfileSave = async () => {
    await updateProfile(profileData);
    toast({ title: 'Profile Updated', description: 'Your profile information has been saved.', status: 'success' });
  };

  return (
    <VStack spacing={6} align="stretch">
      <Box bg="white" p={8} borderRadius="lg" border="1px" borderColor="gray.200">
        <VStack spacing={6} align="stretch">
          <HStack spacing={6}>
            <Avatar size="2xl" name={profileData.name} bg="primary.500" />
            <VStack align="start" spacing={2}>
              <Heading size="md">{profileData.name}</Heading>
              <Box color="gray.600" fontSize="sm">Super Admin</Box>
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
          </SimpleGrid>

          <Button leftIcon={<Icon as={FiSave} />} colorScheme="primary" alignSelf="start" onClick={handleProfileSave}>
            Save Changes
          </Button>
        </VStack>
      </Box>
    </VStack>
  );
};

export default ProfileSettingsForm;
