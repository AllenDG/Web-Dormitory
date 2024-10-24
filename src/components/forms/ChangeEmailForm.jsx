import {
  Box,
  Input,
  Button,
  FormControl,
  FormLabel,
  VStack,
  Heading,
  Text,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { EmailIcon } from "@chakra-ui/icons"; // Import an email icon

export default function ChangeEmailForm() {
  return (
    <Box
      w="100%"
      maxW="500px"
      p={8}
      borderRadius="md"
      bg="#fff" // Light background for the card
      boxShadow="xl" // Enhanced shadow for better aesthetics
      mx="auto" // Centering the box horizontally
      mt={12} // Spacing from the top
    >
      {/* Form Heading */}
      <Heading as="h2" size="lg" textAlign="center" mb={6}>
        Change Your Email
      </Heading>
      <Text fontSize="md" textAlign="center" mb={8} color="gray.600">
        Update your email to stay up to date with notifications.
      </Text>

      <VStack spacing={5} align="flex-start">
        {/* Current Email */}
        <FormControl isRequired>
          <FormLabel>Current Email</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <EmailIcon color="gray.400" />
            </InputLeftElement>
            <Input placeholder="Enter current email" type="email" />
          </InputGroup>
        </FormControl>

        {/* New Email */}
        <FormControl isRequired>
          <FormLabel>New Email</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <EmailIcon color="gray.400" />
            </InputLeftElement>
            <Input placeholder="Enter new email" type="email" />
          </InputGroup>
        </FormControl>

        {/* Save Changes Button */}
        <Button
          mt={6}
          colorScheme="blue"
          w="100%"
          size="lg"
          boxShadow="md"
          _hover={{ boxShadow: "lg", transform: "scale(1.02)" }} // Slight hover effect for the button
        >
          Save Changes
        </Button>
      </VStack>
    </Box>
  );
}
