import {
  Box,
  Input,
  Button,
  FormControl,
  FormLabel,
  VStack,
  InputGroup,
  InputRightElement,
  IconButton,
  useDisclosure,
  Heading,
  Text,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons"; // Import visibility icons

export default function ChangePasswordForm() {
  // Use the Chakra UI disclosure hook to toggle password visibility
  const { isOpen: showCurrent, onToggle: toggleShowCurrent } = useDisclosure();
  const { isOpen: showNew, onToggle: toggleShowNew } = useDisclosure();
  const { isOpen: showConfirm, onToggle: toggleShowConfirm } = useDisclosure();

  return (
    <Box
      w="100%"
      maxW="500px"
      p={8}
      borderRadius="md"
      bg="#fff" // Light background for the card
      boxShadow="xl" // Enhanced shadow for a more modern look
      mx="auto" // Centering the box horizontally
      mt={12} // Spacing from the top
    >
      {/* Form Heading */}
      <Heading as="h2" size="lg" textAlign="center" mb={6}>
        Change Your Password
      </Heading>
      <Text fontSize="md" textAlign="center" mb={8} color="gray.600">
        Ensure your account is using a strong, unique password.
      </Text>

      <VStack spacing={5} align="flex-start">
        {/* Current Password */}
        <FormControl isRequired>
          <FormLabel>Current Password</FormLabel>
          <InputGroup>
            <Input
              type={showCurrent ? "text" : "password"}
              placeholder="Enter current password"
            />
            <InputRightElement>
              <IconButton
                variant="ghost"
                aria-label="Toggle Password Visibility"
                icon={showCurrent ? <ViewOffIcon /> : <ViewIcon />}
                onClick={toggleShowCurrent}
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>

        {/* New Password */}
        <FormControl isRequired>
          <FormLabel>New Password</FormLabel>
          <InputGroup>
            <Input
              type={showNew ? "text" : "password"}
              placeholder="Enter new password"
            />
            <InputRightElement>
              <IconButton
                variant="ghost"
                aria-label="Toggle Password Visibility"
                icon={showNew ? <ViewOffIcon /> : <ViewIcon />}
                onClick={toggleShowNew}
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>

        {/* Confirm New Password */}
        <FormControl isRequired>
          <FormLabel>Confirm New Password</FormLabel>
          <InputGroup>
            <Input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm new password"
            />
            <InputRightElement>
              <IconButton
                variant="ghost"
                aria-label="Toggle Password Visibility"
                icon={showConfirm ? <ViewOffIcon /> : <ViewIcon />}
                onClick={toggleShowConfirm}
              />
            </InputRightElement>
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
