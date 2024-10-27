import { Flex, Text } from "@chakra-ui/react";
import SubscriptionTable from "../tables/SubscriptionTable";

export default function ChangeSubscriptionForm() {
  return (
    <Flex direction="column" alignItems="center" justifyContent="center">
      <Text fontSize="lg" mb={8} textAlign="center">
        Choose the right plan for your adventure, with <b>free</b>,{" "}
        <b>standard</b>, and <b>premium</b> options.
      </Text>
      <SubscriptionTable />
    </Flex>
  );
}
