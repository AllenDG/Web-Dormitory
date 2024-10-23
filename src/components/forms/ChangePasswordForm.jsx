import {
  Box,
  Input,
  Button,
  FormControl,
  FormLabel,
  VStack,
} from "@chakra-ui/react";

export default function ChangePasswordForm() {
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
        {/* Current Password */}
        <FormControl>
          <FormLabel>Current Password</FormLabel>
          <Input type="password" placeholder="Enter current password" />
        </FormControl>

        {/* New Password */}
        <FormControl>
          <FormLabel>New Password</FormLabel>
          <Input type="password" placeholder="Enter new password" />
        </FormControl>

        {/* Confirm New Password */}
        <FormControl>
          <FormLabel>Confirm New Password</FormLabel>
          <Input type="password" placeholder="Confirm new password" />
        </FormControl>

        {/* Save Changes Button */}
        <Button mt={4} colorScheme="blue" w="100%">
          Save Changes
        </Button>
      </VStack>
    </Box>
  );
}
