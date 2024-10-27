import {
  Box,
  Button,
  VStack,
  Heading,
  Text,
  useColorModeValue,
  LightMode,
} from "@chakra-ui/react";
import PasswordInput from "../ui/PasswordInput";

export default function ChangePasswordForm() {
  const bgColor = useColorModeValue("bg.light", "bg.dark");

  return (
    <Box
      w="100%"
      maxW="500px"
      p={8}
      borderRadius="md"
      bgColor={bgColor}
      boxShadow="xl"
      mx="auto" 
      mt={12}
    >
      <Heading as="h2" size="lg" textAlign="center" mb={6}>
        Change Your Password
      </Heading>
      <Text fontSize="md" textAlign="center" mb={8} color="gray.600">
        Ensure your account is using a strong, unique password.
      </Text>

      <VStack spacing={5} align="flex-start">
        <PasswordInput
          label="Current Password"
          placeholder="Enter current password"
          isRequired={true}
        />

        <PasswordInput
          label="New Password"
          placeholder="Enter new password"
          isRequired={true}
        />

        <PasswordInput
          label="Confirm New Password"
          placeholder="Confirm new password"
          isRequired={true}
        />

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
