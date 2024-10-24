import {
  Box,
  Input,
  Button,
  FormControl,
  FormLabel,
  VStack,
  Avatar,
  IconButton,
  Switch,
  HStack,
  Text,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaEdit } from "react-icons/fa";

export default function EditDetailsForm() {
 
  const cardBgColor = useColorModeValue("white", "gray.700"); // same as dashboard

  return (
    <Box
      w="100%"
      maxW="600px"
      p={8}
      borderRadius="lg"
      bg={cardBgColor} // same as dashboard card background
      boxShadow="lg"
      mx="auto" // Center the box horizontally
    >
      {/* Form Heading */}
      <Heading as="h2" size="lg" textAlign="center" mb={6}>
        Edit Your Details
      </Heading>

      <VStack spacing={6} align="flex-start" >
        {/* Edit Profile Picture */}
        <FormControl>
          <FormLabel>Profile Picture</FormLabel>
          <HStack>
            <Avatar size="lg" name="User" src="https://bit.ly/dan-abramov" />
            <IconButton
              icon={<FaEdit />}
              aria-label="Edit Profile Picture"
              size="sm"
              colorScheme="blue"
              variant="outline" // Outlined button for subtle effect
              _hover={{ bg: "blue.50" }} // Light hover effect
            />
            <Text fontSize="sm" color="gray.600">
              Change your profile picture
            </Text>
          </HStack>
        </FormControl>

        {/* Business Name */}
        <FormControl isRequired>
          <FormLabel>Business Name</FormLabel>
          <Input
            placeholder="Enter business name"
            focusBorderColor="blue.400" // Blue highlight on focus
          />
        </FormControl>

        {/* First Name */}
        <FormControl isRequired>
          <FormLabel>First Name</FormLabel>
          <Input
            placeholder="Enter first name"
            focusBorderColor="blue.400" // Blue highlight on focus
          />
        </FormControl>

        {/* Last Name */}
        <FormControl isRequired>
          <FormLabel>Last Name</FormLabel>
          <Input
            placeholder="Enter last name"
            focusBorderColor="blue.400" // Blue highlight on focus
          />
        </FormControl>

        {/* Chat Available Toggle */}
        <FormControl display="flex" alignItems="center">
          <FormLabel mb="0">Chat Availability</FormLabel>
          <Switch
            colorScheme="blue"
            size="lg" // Larger switch for better interaction
          />
          <Text fontSize="sm" ml={3} color="gray.600">
            Toggle to set your availability
          </Text>
        </FormControl>

        {/* Save Changes Button */}
        <Button
          mt={6}
          colorScheme="blue"
          w="100%"
          size="lg"
          boxShadow="md"
          _hover={{ boxShadow: "lg", transform: "scale(1.02)" }} // Button hover effect
        >
          Save Changes
        </Button>
      </VStack>
    </Box>
  );
}
