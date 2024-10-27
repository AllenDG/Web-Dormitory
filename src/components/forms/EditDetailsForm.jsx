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
  LightMode,
} from "@chakra-ui/react";
import { FaEdit } from "react-icons/fa";

export default function EditDetailsForm() {
  const bgColor = useColorModeValue("bg.light", "bg.dark");

  return (
    <Box
      w="100%"
      maxW="600px"
      p={8}
      borderRadius="lg"
      bg={bgColor}
      boxShadow="lg"
      mx="auto"
    >
      <Heading as="h2" size="lg" textAlign="center" mb={6}>
        Edit Your Details
      </Heading>

      <VStack spacing={6} align="flex-start">
        <FormControl>
          <FormLabel>Profile Picture</FormLabel>
          <HStack>
            <Avatar size="lg" name="User" src="https://bit.ly/dan-abramov" />
            <LightMode>
              <IconButton
                icon={<FaEdit />}
                aria-label="Edit Profile Picture"
                size="sm"
                colorScheme="primary"
                variant="outline"
                _hover={{ bg: "blue.50" }}
              />
            </LightMode>
            <Text fontSize="sm" color="gray.600">
              Change your profile picture
            </Text>
          </HStack>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Business Name</FormLabel>
          <Input
            placeholder="Enter business name"
            focusBorderColor="primary.500"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>First Name</FormLabel>
          <Input
            placeholder="Enter first name"
            focusBorderColor="primary.500" 
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Last Name</FormLabel>
          <Input
            placeholder="Enter last name"
            focusBorderColor="primary.500"
          />
        </FormControl>

        <FormControl display="flex" flexWrap="wrap" alignItems="center">
          <FormLabel mb="0">Chat Availability</FormLabel>
          <Switch
            colorScheme="blue"
            size="lg"
          />
          <Text fontSize="sm" ml={3} color="gray.600">
            Toggle to set your availability
          </Text>
        </FormControl>

        <LightMode>
          <Button
            mt={6}
            colorScheme="primary"
            w="100%"
            size="lg"
            boxShadow="md"
            _hover={{ boxShadow: "lg", transform: "scale(1.02)" }}
          >
            Save Changes
          </Button>
        </LightMode>
      </VStack>
    </Box>
  );
}
