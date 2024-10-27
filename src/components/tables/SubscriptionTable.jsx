import {
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  LightMode,
} from "@chakra-ui/react";
import subscriptionData from "../../data/subscription.json";

export default function SubscriptionTable() {
  const bgColor = useColorModeValue("bg.light", "bg.dark");

  return (
    <Table
      variant="simple"
      size="lg"
      bg="white"
      borderRadius="md"
      boxShadow="lg"
    >
      <Thead bg="primary.500">
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
      <Tbody bgColor={bgColor}>
        {Object.keys(subscriptionData.subscriptions[0].features).map(
          (feature) => (
            <Tr key={feature}>
              <Td>{feature.charAt(0).toUpperCase() + feature.slice(1)}</Td>
              {subscriptionData.subscriptions.map((sub) => (
                <Td key={sub.name} textAlign="center">
                  {sub.features[feature] === true
                    ? "✔️"
                    : sub.features[feature] === false
                    ? "❌"
                    : sub.features[feature]}
                </Td>
              ))}
            </Tr>
          )
        )}
        <Tr>
          <Td></Td>
          {subscriptionData.subscriptions.map((sub) => (
            <Td key={sub.name} textAlign="center">
              <LightMode>
                <Button colorScheme="primary" w="full">
                  Get Started
                </Button>
              </LightMode>
            </Td>
          ))}
        </Tr>
      </Tbody>
    </Table>
  );
}
