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
  useColorModeValue,
  LightMode,
} from "@chakra-ui/react";
import { EmailIcon } from "@chakra-ui/icons";

export default function ChangeEmailForm() {
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
        Change Your Email
      </Heading>
      <Text fontSize="md" textAlign="center" mb={8} color="gray.600">
        Update your email to stay up to date with notifications.
      </Text>

      <VStack spacing={5} align="flex-start">
        <FormControl isRequired>
          <FormLabel>Current Email</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <EmailIcon color="gray.400" />
            </InputLeftElement>
            <Input
              type="email"
              placeholder="Enter current email"
              focusBorderColor="primary.500"
            />
          </InputGroup>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>New Email</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <EmailIcon color="gray.400" />
            </InputLeftElement>
            <Input
              type="email"
              placeholder="Enter new email"
              focusBorderColor="primary.500"
            />
          </InputGroup>
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
