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
  } from "@chakra-ui/react";
  import { FaEdit } from "react-icons/fa";
  
  export default function EditDetailsForm() {
    return (
      <Box
        w="100%"
        maxW="600px"
        p={6}
        border="1px solid"
        borderColor="gray.300"
        borderRadius="md"
        bg="#fff" // Card background color
        boxShadow="lg"
        mt={8} // Added top margin
      >
        <VStack spacing={4} align="flex-start">
          {/* Edit Profile Picture */}
          <FormControl>
            <FormLabel>Profile Picture</FormLabel>
            <Box display="flex" alignItems="center">
              <Avatar size="lg" name="User" src="https://bit.ly/dan-abramov" />
              <IconButton
                icon={<FaEdit />}
                aria-label="Edit Profile Picture"
                ml={4}
                colorScheme="blue"
              />
            </Box>
          </FormControl>
  
          {/* Business Name */}
          <FormControl>
            <FormLabel>Business Name</FormLabel>
            <Input placeholder="Enter business name" />
          </FormControl>
  
          {/* First Name */}
          <FormControl>
            <FormLabel>First Name</FormLabel>
            <Input placeholder="Enter first name" />
          </FormControl>
  
          {/* Last Name */}
          <FormControl>
            <FormLabel>Last Name</FormLabel>
            <Input placeholder="Enter last name" />
          </FormControl>
  
          {/* Chat Available Toggle */}
          <FormControl display="flex" alignItems="center">
            <FormLabel mb="0">Chat Available</FormLabel>
            <Switch colorScheme="blue" />
          </FormControl>
  
          {/* Save Changes Button */}
          <Button mt={4} colorScheme="blue" w="100%">
            Save Changes
          </Button>
        </VStack>
      </Box>
    );
  }
  