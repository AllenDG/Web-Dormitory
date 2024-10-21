import { Flex, useColorModeValue } from "@chakra-ui/react";
import AddPropertyForm from "../components/forms/AddPropertyForm";
import CreateOwnerForm from "../components/forms/CreateOwnerForm";
import PaymentMethodForm from "../components/forms/PaymentMethodForm";

export default function PostMyPropertyPage() {
  const bgColor = useColorModeValue("bg.light", "bg.dark");
  return (
    <Flex
      direction="column"
      minH="100vh"
      justify="center"
      align="center"
      bg={bgColor}
    >
      <AddPropertyForm />
      <CreateOwnerForm/>
      <PaymentMethodForm/>
    </Flex>
  );
}
