import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
} from "@chakra-ui/react";

export default function ChangeSubscriptionForm() {
  // Color palette
  const primaryColor = "#F4F4F4";
  const secondaryColor = "#0084FF";

  return (
    <Box
      p={6}
      mt={8}
      bg={primaryColor}
      borderRadius="md"
      maxW="900px"
      mx="auto"
    >
  
      <Text fontSize="lg" mb={8} textAlign="center">
        Choose the right plan for your adventure, with <b>free</b>,{" "}
        <b>standard</b>, and <b>premium</b> options.
      </Text>

      {/* Subscription Table */}
      <Table
        variant="simple"
        size="lg"
        bg="white"
        borderRadius="md"
        boxShadow="lg"
      >
        <Thead bg={secondaryColor}>
          <Tr>
            <Th color="white">Features</Th>
            <Th color="white" textAlign="center">
              Free
            </Th>
            <Th color="white" textAlign="center">
              Standard
            </Th>
            <Th color="white" textAlign="center">
              Premium
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {/* Permanent Account */}
          <Tr>
            <Td>Permanent Account</Td>
            <Td textAlign="center">✔️</Td>
            <Td textAlign="center">✔️</Td>
            <Td textAlign="center">✔️</Td>
          </Tr>

          {/* Analytics */}
          <Tr>
            <Td>Analytics</Td>
            <Td textAlign="center">❌</Td>
            <Td textAlign="center">Basic Analytics</Td>
            <Td textAlign="center">Advanced Analytics</Td>
          </Tr>

          {/* Boost Content */}
          <Tr>
            <Td>Boost Content</Td>
            <Td textAlign="center">❌</Td>
            <Td textAlign="center">Boost for 2 weeks</Td>
            <Td textAlign="center">Boost for 1 month</Td>
          </Tr>

          {/* Expire */}
          <Tr>
            <Td>Account Expiry</Td>
            <Td textAlign="center">❌</Td>
            <Td textAlign="center">Expires in 1 month</Td>
            <Td textAlign="center">Never Expires</Td>
          </Tr>

          {/* Chatbot */}
          <Tr>
            <Td>Chatbot Support</Td>
            <Td textAlign="center">❌</Td>
            <Td textAlign="center">❌</Td>
            <Td textAlign="center">✔️</Td>
          </Tr>

          {/* Email Ads */}
          <Tr>
            <Td>Email Ads</Td>
            <Td textAlign="center">❌</Td>
            <Td textAlign="center">✔️</Td>
            <Td textAlign="center">✔️</Td>
          </Tr>

          {/* Get Started Buttons */}
          <Tr>
            <Td></Td>
            <Td textAlign="center">
              <Button colorScheme="blue" w="full">
                Get Started
              </Button>
            </Td>
            <Td textAlign="center">
              <Button colorScheme="blue" w="full">
                Get Started
              </Button>
            </Td>
            <Td textAlign="center">
              <Button colorScheme="blue" w="full">
                Get Started
              </Button>
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </Box>
  );
}
