import {
  Box,
  Input,
  Button,
  FormControl,
  FormLabel,
  VStack,
} from "@chakra-ui/react";

export default function ChangeEmailForm() {
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
        {/* Current Email */}
        <FormControl>
          <FormLabel>Current Email</FormLabel>
          <Input placeholder="Enter current email" type="email" />
        </FormControl>

        {/* New Email */}
        <FormControl>
          <FormLabel>New Email</FormLabel>
          <Input placeholder="Enter new email" type="email" />
        </FormControl>

        {/* Save Changes Button */}
        <Button mt={4} colorScheme="blue" w="100%">
          Save Changes
        </Button>
      </VStack>
    </Box>
  );
}
